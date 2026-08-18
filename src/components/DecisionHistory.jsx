import React, { useState } from 'react';
import { useDecisionHistory } from '../hooks/useDecisionHistory';
import DecisionDetail from './DecisionDetail';

export default function DecisionHistory() {
  const { decisiones, loading, error, eliminarDecision, cargarHistorial } = useDecisionHistory();
  const [selectedDecision, setSelectedDecision] = useState(null);

  if (loading) return <p style={{ color: '#64748b' }}>Cargando historial...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>Error al cargar el historial.</p>;

  return (
    <div>
      <h3 style={{ color: '#f8fafc', marginBottom: '12px', fontSize: '1.1rem' }}>📜 Historial de decisiones</h3>
      
      {selectedDecision && (
        <DecisionDetail 
          decision={selectedDecision} 
          onClose={() => setSelectedDecision(null)}
          onUpdate={() => {
            cargarHistorial();
            setSelectedDecision(null);
          }}
        />
      )}

      {decisiones.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Aún no has tomado decisiones.</p>
      ) : (
        decisiones.map((item) => (
          <div 
            key={item.id} 
            className="card" 
            style={{ marginBottom: '12px', cursor: 'pointer', position: 'relative' }}
            onClick={() => setSelectedDecision(item)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '1rem' }}>{item.situation}</h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  eliminarDecision(item.id);
                }} 
                style={{ background: 'transparent', color: '#ef4444', border: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            
            <p style={{ color: '#818cf8', margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '500' }}>
              {item.recommendation}
            </p>

            {item.outcome && (
              <p style={{ color: '#10b981', margin: '4px 0', fontSize: '0.85rem' }}>
                ✅ <strong>Resultado:</strong> {item.outcome}
              </p>
            )}

            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
              {new Date(item.createdAt).toLocaleString()} • <em>Toca para ver detalle / agregar resultado</em>
            </span>
          </div>
        ))
      )}
    </div>
  );
}
