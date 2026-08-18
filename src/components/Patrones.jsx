import React from 'react';
import { usePatterns } from '../hooks/usePatterns';

export default function Patrones() {
  const { patrones, loading, actualizarPatrones } = usePatterns();

  if (loading) return <p style={{ color: '#64748b' }}>Analizando patrones...</p>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="card-title" style={{ margin: 0 }}>🔎 Patrones Detectados</div>
        <button 
          onClick={actualizarPatrones} 
          style={{ background: '#334155', color: '#f8fafc', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          🔄 Analizar
        </button>
      </div>

      <div>
        {patrones.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Aún no hay suficientes datos para detectar patrones claros.</p>
        ) : (
          patrones.map((p) => (
            <div key={p.id} className="item-box" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ color: '#f8fafc', margin: 0, fontSize: '0.95rem' }}>{p.patron}</h4>
                <span style={{ 
                  background: p.confianza === 'Alta' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                  color: p.confianza === 'Alta' ? '#10b981' : '#f59e0b', 
                  fontSize: '0.7rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}>
                  Confianza: {p.confianza}
                </span>
              </div>
              <p style={{ color: '#94a3b8', margin: '0 0 6px 0', fontSize: '0.85rem' }}>{p.descripcion}</p>
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>📊 {p.frecuencia}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
