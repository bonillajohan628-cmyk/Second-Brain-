import React, { useState, useEffect } from 'react';
import { db } from '../db/database';

export default function Pomodoro() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' o 'break'
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    if (mode === 'work') {
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);
      
      // Registrar sesión de estudio como memoria/hábito implícito
      await db.recuerdos.add({
        contenido: `Sesión de Pomodoro completada (25 min de enfoque). Total del día: ${newCount}`,
        fecha: new Date().toLocaleDateString('es-ES')
      });

      setMode('break');
      setTimeLeft(BREAK_TIME);
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="card-title" style={{ marginBottom: '8px' }}>
        {mode === 'work' ? '🧠 ModoSesión de Enfoque' : '☕ Descanso Corto'}
      </div>

      <div style={{ fontSize: '3rem', fontWeight: 'bold', color: mode === 'work' ? '#818cf8' : '#10b981', margin: '16px 0' }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <button 
          onClick={toggleTimer}
          style={{ 
            background: isRunning ? '#ef4444' : '#6366f1', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            cursor: 'pointer' 
          }}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>

        <button 
          onClick={resetTimer}
          style={{ 
            background: '#334155', 
            color: '#f8fafc', 
            border: 'none', 
            padding: '10px 16px', 
            borderRadius: '8px', 
            cursor: 'pointer' 
          }}
        >
          Reiniciar
        </button>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
        🍅 Sesiones completadas hoy: <strong style={{ color: '#f8fafc' }}>{completedSessions}</strong>
      </p>
    </div>
  );
}
