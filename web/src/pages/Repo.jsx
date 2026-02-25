import React, { useEffect, useState } from 'react'
const API = 'http://localhost:4000/api';
export default function Repo({ id, onBack }){
  const [repo, setRepo] = useState(null);
  const [file, setFile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  useEffect(()=>{ fetch(`${API}/repos/${id}`).then(r=>r.json()).then(setRepo); fetch(`${API}/repos/${id}/issues`).then(r=>r.json()).then(setIssues); },[id]);
  async function upload(){
    if (!file) return alert('pick file');
    const token = localStorage.getItem('token');
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch(`${API}/repos/${id}/upload`, { method: 'POST', headers: { 'Authorization': token?`Bearer ${token}`:'' }, body: fd });
    if (res.ok) { alert('uploaded'); setFile(null); setRepo(await (await fetch(`${API}/repos/${id}`)).json()); }
    else alert('upload failed');
  }
  async function createIssue(){
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/repos/${id}/issues`, { method: 'POST', headers: { 'Content-Type':'application/json','Authorization': token?`Bearer ${token}`:'' }, body: JSON.stringify({ title, body: '' })});
    if (res.ok){ setTitle(''); setIssues(await (await fetch(`${API}/repos/${id}/issues`)).json()); }
    else alert('issue failed');
  }
  if (!repo) return <div className="page"><button onClick={onBack}>◀ Back</button><div>Loading...</div></div>
  return (
    <div className="page repo-page">
      <button onClick={onBack} className="back">◀ Back</button>
      <header className="repo-hero">
        <h2>{repo.name}</h2>
        <div className="muted">{repo.description}</div>
      </header>
      <section className="repo-grid">
        <div className="panel">
          <h4>Files</h4>
          <ul>
            {repo.files.map(f=> <li key={f.path}><pre className="file-preview">{f.path}</pre></li>)}
          </ul>
          <div className="upload">
            <input type="file" onChange={e=>setFile(e.target.files[0])} />
            <button onClick={upload}>Upload file</button>
          </div>
        </div>
        <div className="panel">
          <h4>Issues</h4>
          <ul>
            {issues.map(i=> <li key={i.id}><strong>{i.title}</strong><div className="muted">{i.createdAt}</div></li>)}
          </ul>
          <input placeholder="Issue title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button onClick={createIssue}>Create issue</button>
        </div>
      </section>
    </div>
  )
}
