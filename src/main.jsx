import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';
class AppErrorBoundary extends React.Component { state={error:null}; static getDerivedStateFromError(error){return{error}}; render(){if(this.state.error)return <main className="grid min-h-screen place-items-center p-5"><section className="glass max-w-lg rounded-[2rem] p-8 text-center"><p className="text-4xl">⚠️</p><h1 className="mt-4 font-serif text-3xl">We hit a kitchen snag.</h1><p className="mt-3 opacity-65">The page could not start safely. Refresh to try again.</p><button className="btn-primary mt-6" onClick={()=>location.reload()}>Refresh app</button></section></main>;return this.props.children} }
createRoot(document.getElementById('root')).render(<React.StrictMode><AppErrorBoundary><App /><Toaster position="top-right" toastOptions={{style:{borderRadius:'14px',background:'#25201d',color:'#fff'}}}/></AppErrorBoundary></React.StrictMode>);
