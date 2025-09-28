// components/Input.tsx
'use client';
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: React.ReactNode;
};

export default function Input({ label, icon, ...rest }: Props) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-inner">
        {icon && <span className="input-icon">{icon}</span>}
        <input className="input-field" {...rest} />
      </div>
      <style jsx>{`
        .input-wrapper { width:100%; margin-bottom:0.75rem; }
        .input-label { display:block; margin-bottom:0.25rem; font-weight:600; font-size:0.9rem; color:var(--muted); }
        .input-inner { display:flex; align-items:center; gap:0.5rem; background:var(--bg-input); border:1px solid var(--border); padding:0.45rem 0.6rem; border-radius:10px; }
        .input-icon { display:inline-flex; align-items:center; justify-content:center; min-width:1.6rem; opacity:0.85; }
        .input-field { border:0; outline:none; background:transparent; flex:1; font-size:1rem; color:var(--text); }
      `}</style>
    </div>
  );
}
