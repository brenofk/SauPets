// app/register/page.tsx
'use client';
import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (senha !== confirm) return setMsg('Senhas não conferem');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ nome, email, telefone, senha })
      });
      if (!res.ok) {
        const body = await res.json().catch(()=>({message:'Erro'}));
        throw new Error(body?.message || 'Falha no cadastro');
      }
      const body = await res.json();
      setMsg('Cadastro efetuado com sucesso!');
      // opcional: redirecionar
    } catch (err: any) {
      setMsg(err?.message || 'Erro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{paddingTop:30}}>
      <div className="card form">
        <h2>Criar conta</h2>
        <p style={{color:'var(--muted)'}}>Preencha os dados do responsável (tutor)</p>

        <form onSubmit={handleSubmit}>
          <Input label="Nome" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" />
          <Input label="E-mail" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email" />
          <Input label="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} placeholder="(xx) xxxxx-xxxx" />
          <Input label="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" />
          <Input label="Confirmar senha" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirme a senha" />

          {msg && <div style={{marginBottom:10, color: msg.includes('sucesso') ? 'green' : 'crimson'}}>{msg}</div>}
          <div style={{display:'flex', gap:10}}>
            <Button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : <><UserPlus size={14} />Cadastrar</>}</Button>
            <Button variant="ghost" type="button" onClick={()=> window.location.href = '/login'}>Voltar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
