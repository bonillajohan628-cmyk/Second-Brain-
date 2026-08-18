import React, { useState } from 'react';
import { useMemories } from '../hooks/useMemories';

export default function Recuerdos() {
  const [texto, setTexto] = useState('');
  const { recuerdos, guardarRecuerdo, eliminarRecuerdo } = useMemories();

  const handleGuardar = async () => {
    if (!texto.trim()) return;
    await guardarRecuerdo(texto);
    setTexto('');
  };

  return (
    <div className="card">
      <div className="card-title">📓 Memorias & Recuerdos</div>
      
      <textarea
        placeholder="Escribe un pensamiento, nota o aprendizaje..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        style={{ marginBottom: '12px' }}
      />
      
      <button onClick={handleGuardar} className="btn-success">
        Guardar Memoria
      </button>

      <div>
        {recuerdos.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Aún no tienes recuerdos guardados.</p>
        ) : (
          recuerdos.map((item) => (
            <div key={item.id} className="item-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#f8fafc', margin: 0, fontSize: '0.95rem' }}>{item.contenido}</p>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={() => eliminarRecuerdo(item.id)} 
                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
