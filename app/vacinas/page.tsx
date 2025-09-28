// app/vacinas/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Plus, Trash2 } from 'lucide-react';

type Vacina = {
  id: string;
  petName: string;
  vacina: string;
  data: string;
  veterinario?: string;
};

export default function VacinasPage() {
  const [petName, setPetName] = useState('');
  const [vacina, setVacina] = useState('');
  const [data, setData] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    // carregar vacinas locais / da API
    (async ()=>{
      try {
        const res = await fetch('/api/vacinas');
        if (res.ok) {
          const list = await res.json();
          setVacinas(list || []);
        } else {
          // fallback: vazio
        }
      } catch(e) {
        // offline / erro -> manter lista vazia
      }
    })();
  }, []);

  const handleAdd = async (e?:React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const newItem = { id: String(Date.now()), petName, vacina, data, veterinario };
      // POST para a API:
      const res = await fetch('/api/vacinas', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const saved = await res.json().catch(()=> newItem);
        setVacinas(prev => [saved, ...prev]);
        setPetName(''); setVacina(''); setData(''); setVeterinario('');
      } else {
        // fallback local
        setVacinas(prev => [newItem, ...prev]);
      }
    } catch(e) {
      setVacinas(prev => [{ id:String(Date.now()), petName, vacina, data, veterinario }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    // tenta remover via API, se falhar remove localmente
    try {
      const res = await fetch(`/api/vacinas/${id}`, { method:'DELETE' });
      if (res.ok) setVacinas(v => v.filter(x=>x.id !== id));
      else setVacinas(v => v.filter(x=>x.id !== id));
    } catch {
      setVacinas(v => v.filter(x=>x.id !== id));
    }
  };

  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="card" style={{marginBottom:16}}>
        <h3 style={{marginTop:0}}>Cadastrar Vacina</h3>
        <form onSubmit={handleAdd} style={{display:'grid', gap:10}}>
          <Input label="Nome do pet" value={petName} onChange={e=>setPetName(e.target.value)} placeholder="Ex: Rex" />
          <Input label="Vacina" value={vacina} onChange={e=>setVacina(e.target.value)} placeholder="Ex: V8" />
          <Input label="Data" type="date" value={data} onChange={e=>setData(e.target.value)} />
          <Input label="Veterinário (opcional)" value={veterinario} onChange={e=>setVeterinario(e.target.value)} />
          <div style={{display:'flex', gap:10}}>
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : <><Plus size={14}/>Salvar</>}</Button>
            <Button variant="ghost" type="button" onClick={()=>{ setPetName(''); setVacina(''); setData(''); setVeterinario(''); }}>Limpar</Button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Vacinas cadastradas</h3>
        <div style={{display:'grid', gap:10}}>
          {vacinas.length === 0 && <div style={{color:'var(--muted)'}}>Nenhuma vacina cadastrada ainda.</div>}
          {vacinas.map(v => (
            <div key={v.id} className="row card" style={{alignItems:'center', justifyContent:'space-between', padding:'0.6rem'}}>
              <div>
                <div style={{fontWeight:700}}>{v.petName} — {v.vacina}</div>
                <div style={{color:'var(--muted)', fontSize:13}}>{v.data} {v.veterinario ? `• ${v.veterinario}` : ''}</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button aria-label="remover" onClick={()=>handleRemove(v.id)} title="Remover" style={{background:'transparent', border:0, cursor:'pointer'}}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
