import React, { useState } from 'react';
import { useHabits } from '../hooks/useHabits';

function ArbolRacha({ rachaActual = 0 }) {
  const dias = Number(rachaActual) || 0;

  const obtenerEtapa = (d) => {
    if (d === 0) return { emoji: '🌱', titulo: 'Semilla Recién Plantada', desc: 'Completa un hábito hoy para darle agua y empezar a germinar.', color: '#94a3b8' };
    if (d < 3) return { emoji: '🌿', titulo: 'Brote Joven', desc: '¡Tu disciplina empieza a dar los primeros brotes!', color: '#4ade80' };
    if (d < 7) return { emoji: '🪴', titulo: 'Planta Robusta', desc: 'Casi cumples tu primera semana constante.', color: '#22c55e' };
    if (d < 14) return { emoji: '🌳', titulo: 'Árbol Joven', desc: 'Tus raíces de hábitos están firmes y fuertes.', color: '#16a34a' };
    if (d < 30) return { emoji: '🌲', titulo: 'Árbol Robusto', desc: '¡Una racha impresionante! Un verdadero bosque de enfoque.', color: '#15803d' };
    return { emoji: '🎄✨', titulo: 'Bosque Ancestral', desc: 'Dominio total de tu Segundo Cerebro.', color: '#eab308' };
  };

  const etapa = obtenerEtapa(dias);

  const solicitarNotificaciones = async () => {
    if ('Notification' in window) {
      const permiso = await Notification.requestPermission();
      if (permiso === 'granted') {
        new Notification('🧠 Second Brain', {
          body: '¡Notificaciones activadas! Te recordaremos mantener tu árbol vivo.',
          icon: 'https://cdn-icons-png.flaticon.com/512/616/616490.png'
        });
      } else {
        alert('Permiso de notificaciones denegado.');
      }
    } else {
      alert('Tu navegador no soporta notificaciones locales.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #334155',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      marginBottom: '16px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
        width: '150px', height: '150px', background: etapa.color,
        filter: 'blur(80px)', opacity: 0.25, borderRadius: '50%'
      }} />

      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
        Evolución de Disciplina
      </div>

      <div style={{ fontSize: '4.5rem', margin: '10px 0', filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.2))' }}>
        {etapa.emoji}
      </div>

      <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '1.2rem' }}>{etapa.titulo}</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 16px 0', padding: '0 10px' }}>{etapa.desc}</p>

      <div style={{ background: '#0f172a', padding: '12px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
          <span>🔥 Racha actual: <strong style={{ color: '#f59e0b' }}>{dias} {dias === 1 ? 'día' : 'días'}</strong></span>
          <span>Siguiente nivel: {dias < 3 ? '3d' : dias < 7 ? '7d' : dias < 14 ? '14d' : '30d'}</span>
        </div>

        <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min((dias / 30) * 100, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      <button
        onClick={solicitarNotificaciones}
        style={{
          background: '#334155',
          color: '#e2e8f0',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        🔔 Activar Recordatorios
      </button>
    </div>
  );
}

export default function Habitos() {
  const { habitos = [], logs = [], rachaActual = 0, crearHabito, registrarCompletado } = useHabits();
  const [nuevoHabito, setNuevoHabito] = useState('');

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoHabito.trim()) return;
    crearHabito(nuevoHabito.trim());
    setNuevoHabito('');
  };

  const hoyStr = new Date().toLocaleDateString('es-ES');

  return (
    <div>
      <ArbolRacha rachaActual={rachaActual} />

      <div className="card">
        <div className="card-title" style={{ marginBottom: '12px' }}>⚡ Control de Hábitos Diarios</div>

        <form onSubmit={handleAgregar} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input 
            type="text"
            placeholder="Ej: Estudiar 30 min, Meditar..."
            value={nuevoHabito}
            onChange={(e) => setNuevoHabito(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              fontSize: '0.88rem'
            }}
          />
          <button 
            type="submit"
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              padding: '0 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            + Agregar
          </button>
        </form>

        {habitos.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No tienes hábitos registrados aún.</p>
        ) : (
          habitos.map((h) => {
            const completadoHoy = logs.some(l => l.habitoId === h.id && l.fecha === hoyStr);
            return (
              <div 
                key={h.id}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  marginBottom: '8px'
                }}
              >
                <span style={{ color: '#f8fafc', fontWeight: '500', fontSize: '0.9rem' }}>{h.nombre}</span>
                <button
                  onClick={() => !completadoHoy && registrarCompletado(h.id)}
                  disabled={completadoHoy}
                  style={{
                    background: completadoHoy ? '#10b981' : '#334155',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    cursor: completadoHoy ? 'default' : 'pointer'
                  }}
                >
                  {completadoHoy ? '✓ Completado' : 'Marcar'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
