import React from 'react';
import { useMetrics } from '../hooks/useMetrics';

export default function Metricas() {
  const { metrics, cargarMetricas } = useMetrics();

  if (metrics.loading) return <p style={{ color: '#64748b' }}>Cargando métricas...</p>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="card-title" style={{ margin: 0 }}>📊 Métricas del Cerebro</div>
        <button 
          onClick={cargarMetricas} 
          style={{ background: '#334155', color: '#f8fafc', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
        >
          🔄 Actualizar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="item-box" style={{ textAlign: 'center', padding: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#818cf8' }}>{metrics.decisionesCount}</span>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Decisiones</p>
        </div>

        <div className="item-box" style={{ textAlign: 'center', padding: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{metrics.recuerdosCount}</span>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Memorias</p>
        </div>

        <div className="item-box" style={{ textAlign: 'center', padding: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>{metrics.habitosCount}</span>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Hábitos</p>
        </div>

        <div className="item-box" style={{ textAlign: 'center', padding: '10px' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>🔥 {metrics.rachaMaxima}d</span>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0 0 0' }}>Mejor Racha</p>
        </div>
      </div>
    </div>
  );
}
