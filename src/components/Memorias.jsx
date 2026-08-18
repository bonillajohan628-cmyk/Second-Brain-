import React, { useState, useEffect } from 'react';

export default function Memorias() {
  const [texto, setTexto] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [memorias, setMemorias] = useState([]);

  // Cargar memorias desde localStorage
  useEffect(() => {
    const data = localStorage.getItem('memorias_db');
    if (data) {
      try {
        setMemorias(JSON.parse(data));
      } catch (e) {
        setMemorias([]);
      }
    }
  }, []);

  // Guardar cambio en localStorage
  const guardarEnStorage = (nuevasMemorias) => {
    setMemorias(nuevasMemorias);
    localStorage.setItem('memorias_db', JSON.stringify(nuevasMemorias));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    const nueva = {
      id: Date.now(),
      texto: texto.trim(),
      fecha: new Date().toLocaleDateString('es-ES')
    };

    const actualizadas = [nueva, ...memorias];
    guardarEnStorage(actualizadas);
    setTexto('');
  };

  const handleEliminar = (id) => {
    const filtradas = memorias.filter(m => m.id !== id);
    guardarEnStorage(filtradas);
  };

  const memoriasFiltradas = memorias.filter(m =>
    m.texto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        📓 Memorias & Recuerdos
      </div>

      <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <textarea 
          placeholder="Escribe un pensamiento, nota o aprendizaje..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows="3"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #334155',
            backgroundColor: '#0f172a',
            color: '#fff',
            fontSize: '0.88rem',
            resize: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button 
          type="submit"
          style={{
            background: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Guardar Memoria
        </button>
      </form>

      <input 
        type="text"
        placeholder="🔍 Buscar recuerdos..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #334155',
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          fontSize: '0.85rem',
          marginBottom: '14px',
          boxSizing: 'border-box'
        }}
      />

      {memoriasFiltradas.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>
          {busqueda ? 'No hay resultados.' : 'No tienes notas guardadas.'}
        </p>
      ) : (
        memoriasFiltradas.map((m) => (
          <div 
            key={m.id}
            style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              marginBottom: '10px'
            }}
          >
            <div>
              <div style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>{m.texto}</div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.fecha}</div>
            </div>
            <button
              onClick={() => handleEliminar(m.id)}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
}
