// app/login/page.tsx
'use client';
import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { LogIn } from 'lucide-react'; // opcional: instalar lucide-react

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Chamada à sua API de autenticação
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({message:'Erro'}));
        throw new Error(body?.message || 'Falha no login');
      }
      const data = await res.json();
      // TODO: redirecionar, salvar token ou atualizar contexto
      console.log('login ok', data);
      // exemplo: window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err?.message || 'Erro ao logar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{paddingTop:40}}>
      <div className="card form">
        <h2 style={{marginBottom:8}}>Entrar</h2>
        <p style={{marginTop:0, marginBottom:16, color:'var(--muted)'}}>Use seu e-mail para entrar no SauPets</p>

        <form onSubmit={handleSubmit}>
          <Input label="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com" />
          <Input label="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div style={{color:'crimson', marginBottom:10}}>{error}</div>}

          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <Button disabled={loading} type="submit"> {loading ? 'Entrando...' : <><LogIn size={16}/>Entrar</>} </Button>
            <Button variant="ghost" type="button" onClick={()=>{ window.location.href = '/register'; }}>Criar conta</Button>
          </div>
        </form>
      </div>
      <style jsx>{`
        h2 { font-size:1.5rem; }
      `}</style>
    </div>
  );
}
