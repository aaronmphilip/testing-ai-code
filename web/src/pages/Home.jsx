import React, { useEffect, useState } from 'react'

const API = 'http://localhost:4000/api';

export default function Home({ onOpenRepo }){
  const [repos, setRepos] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  useEffect(()=>{ fetchRepos(); },[]);
  function fetchRepos(){ fetch(`${API}/repos`).then(r=>r.json()).then(setRepos); }
  async function create(){
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/repos`, { method: 'POST', headers: { 'Content-Type':'application/json','Authorization': token?`Bearer ${token}`:'' }, body: JSON.stringify({ name, description: desc })});
    if (res.ok){ setName(''); setDesc(''); fetchRepos(); } else { alert('create failed'); }
  }
  return (
    <div className="page">
      <header className="hero">
        <h1>ForgeHub</h1>
        <p className="sub">A fast, weird, and bold GitHub alternative — prototype.</p>
      </header>

      <section className="controls">
        <div className="card">
          <h3>Create repo</h3>
          <input placeholder="repo name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <button onClick={create}>Create</button>
        </div>

        <div className="card">
          <h3>Repos</h3>
          <ul className="repo-list">
            {repos.map(r=> (
              <li key={r.id} className="repo-item" onClick={()=>onOpenRepo(r.id)}>
                <strong>{r.name}</strong>
                <div className="muted">{r.description}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bigfoot">Built for fun — bring ideas and chaos.</footer>
    </div>
  )
}
