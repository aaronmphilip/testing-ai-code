import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Repo from './pages/Repo'

export default function App(){
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(()=>{
    const onPop = ()=> setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return ()=> window.removeEventListener('popstate', onPop);
  },[]);
  if (route.startsWith('/repo/')){
    const id = route.replace('/repo/','');
    return <Repo id={id} onBack={()=>{history.pushState({},'', '/'); setRoute('/');}} />
  }
  return <Home onOpenRepo={(id)=>{history.pushState({},'', `/repo/${id}`); setRoute(`/repo/${id}`)}} />
}
