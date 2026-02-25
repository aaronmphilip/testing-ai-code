const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const DB_PATH = path.join(__dirname, 'db.json');
const STORAGE = path.join(__dirname, 'storage');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

if (!fs.existsSync(STORAGE)) fs.mkdirSync(STORAGE, { recursive: true });

function readDB(){
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}
function writeDB(db){
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth' });
  const token = auth.replace('Bearer ', '');
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Simple register/login (no password hashing in prototype)
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username+password required' });
  const db = readDB();
  if (db.users.find(u => u.username === username)) return res.status(400).json({ error: 'user exists' });
  const user = { id: Date.now().toString(), username, password };
  db.users.push(user);
  writeDB(db);
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username } });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid creds' });
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token, user: { id: user.id, username: user.username } });
});

// Repos
app.get('/api/repos', (req, res) => {
  const db = readDB();
  res.json(db.repos);
});

app.post('/api/repos', authMiddleware, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const db = readDB();
  const repo = { id: Date.now().toString(), name, description: description||'', ownerId: req.user.id, createdAt: new Date().toISOString(), files: [] };
  db.repos.push(repo);
  // create storage folder
  const repoDir = path.join(STORAGE, repo.id);
  fs.mkdirSync(repoDir, { recursive: true });
  // create default README
  fs.writeFileSync(path.join(repoDir, 'README.md'), `# ${name}\n\n${description || ''}`);
  repo.files.push({ path: 'README.md', content: `# ${name}\n\n${description || ''}` });
  writeDB(db);
  res.json(repo);
});

const upload = multer({ dest: path.join(__dirname, 'uploads/') });
app.post('/api/repos/:id/upload', authMiddleware, upload.single('file'), (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const repo = db.repos.find(r => r.id === id);
  if (!repo) return res.status(404).json({ error: 'repo not found' });
  if (repo.ownerId !== req.user.id) return res.status(403).json({ error: 'not owner' });
  const repoDir = path.join(STORAGE, repo.id);
  if (!fs.existsSync(repoDir)) fs.mkdirSync(repoDir, { recursive: true });
  // move uploaded file into storage (store raw file with originalname)
  const uploaded = req.file;
  const dest = path.join(repoDir, uploaded.originalname);
  fs.renameSync(uploaded.path, dest);
  const content = fs.readFileSync(dest, 'utf-8');
  repo.files.push({ path: uploaded.originalname, content });
  writeDB(db);
  res.json({ ok: true, file: uploaded.originalname });
});

app.get('/api/repos/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const repo = db.repos.find(r => r.id === id);
  if (!repo) return res.status(404).json({ error: 'repo not found' });
  res.json(repo);
});

// Issues
app.get('/api/repos/:id/issues', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const issues = db.issues.filter(i => i.repoId === id);
  res.json(issues);
});
app.post('/api/repos/:id/issues', authMiddleware, (req, res) => {
  const id = req.params.id;
  const { title, body } = req.body;
  const db = readDB();
  const repo = db.repos.find(r => r.id === id);
  if (!repo) return res.status(404).json({ error: 'repo not found' });
  const issue = { id: Date.now().toString(), repoId: id, title, body, authorId: req.user.id, createdAt: new Date().toISOString() };
  db.issues.push(issue);
  writeDB(db);
  res.json(issue);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`ForgeHub API listening on ${PORT}`));
