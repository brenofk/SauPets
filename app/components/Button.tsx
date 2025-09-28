// components/Button.tsx
'use client';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export default function Button({ children, variant = 'primary', ...rest }: Props) {
  return (
    <button className={`btn ${variant}`} {...rest}>
      {children}
      <style jsx>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          border: 0;
          transition: all 0.2s ease-in-out;
        }
        .btn.primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 6px 18px rgba(14, 165, 164, 0.12);
        }
        .btn.primary:hover {
          filter: brightness(0.95);
        }
        .btn.ghost {
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
        }
        .btn.ghost:hover {
          background: rgba(14, 165, 164, 0.05);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}
