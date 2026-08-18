import React, { useState } from 'react';
import { db } from '../db/database';

export default function DecisionDetail({ decision, onClose, onUpdate }) {
  const [outcome, setOutcome] = useState(decision.outcome || '');
  const [saving, setSaving] = useState(false);

  const handleSaveOutcome = async () => {
    if (!outcome.trim()) return;
    setSaving(true);
    await db.decisiones.update(decision.id, { outcome });
    setSaving(false);
    onUpdate();
  };

  return (
    <div className="card" style={{ border: '1px solid #6366f1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#f8fafc', margin: 0, fontSize: '1.1rem' }}>🔎 Detalle de la Decisión</h3>
        <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>SITUACIÓN</span>
        <p style={{ color: '#f8fafc', fontWeight: 'bold', margin: '2px 0 8px 0' }}>{decision.situation}</p>

        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>OPCIONES EVALUADAS</span>
        <p style={{ color: '#cbd5e1', margin: '2px 0 8px 0', fontSize: '0.9rem' }}>
          {Array.isArray(decision.options) ? decision.options.join(', ') : decision.options}
        </p>

        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>RECOMENDACIÓN DE LA IA</span>
        <p style={{ color: '#818cf8', fontWeight: '500', margin: '2px 0 8px 0' }}>{decision.recommendation}</p>

        {decision.reasoning && (
          <>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>RAZONAMIENTO / MEMORIA UTILIZADA</span>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', italic: 'true', margin: '2px 0 8px 0' }}>
              💡 {decision.reasoning}
            </p>
          </>
        )}
      </div>

      <hr style={{ borderColor: '#334155', margin: '12px 0' }} />

      <div>
        <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: '600' }}>🌱 Resultado Real (Outcome)</span>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '8px' }}>
          ¿Qué pasó al final? Guardar esto ayudará a la IA a aprender para el futuro.
        </p>
        
        <textarea
          placeholder="Ej: Elegí la opción recomendada y me fue excelente..."
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          rows={2}
          style={{ marginBottom: '8px' }}
        />

        <button onClick={handleSaveOutcome} className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
          {saving ? 'Guardando...' : 'Guardar Resultado'}
        </button>
      </div>
    </div>
  );
}
