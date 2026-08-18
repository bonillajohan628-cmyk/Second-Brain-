import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('inicio')

  // Pomodoro
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  // IA Libre
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)

  // Hábitos
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('sb_habits')) || [
    { id: 1, name: 'Leer 20 mins', done: false },
    { id: 2, name: 'Hacer ejercicio', done: false }
  ])
  const [newHabit, setNewHabit] = useState('')

  // Bloc de Memoria
  const [savedNotes, setSavedNotes] = useState(() => JSON.parse(localStorage.getItem('sb_notes')) || [])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  // Persistencia
  useEffect(() => { localStorage.setItem('sb_habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('sb_notes', JSON.stringify(savedNotes)) }, [savedNotes])

  // Timer Pomodoro
  useEffect(() => {
    let timer = null
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const formatTime = (timeInSec) => {
    const m = Math.floor(timeInSec / 60)
    const s = timeInSec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Consulta IA (GET directo Pollinations)
  const askAI = async () => {
    if (!aiPrompt.trim()) return
    setLoadingAi(true)
    setAiResponse('Pensando respuesta...')
    try {
      const res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(aiPrompt))
      const data = await res.text()
      setAiResponse(data)
    } catch (error) {
      setAiResponse('Error al conectar con la IA. Intenta de nuevo.')
    } finally {
      setLoadingAi(false)
    }
  }

  const addHabit = () => {
    if (!newHabit.trim()) return
    setHabits([...habits, { id: Date.now(), name: newHabit, done: false }])
    setNewHabit('')
  }

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  const addNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) return
    setSavedNotes([...savedNotes, { id: Date.now(), title: noteTitle, content: noteContent }])
    setNoteTitle('')
    setNoteContent('')
  }

  const deleteNote = (id) => {
    setSavedNotes(savedNotes.filter(n => n.id !== id))
  }

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">🧠 Second Brain</h1>
      </header>

      <main className="container">
        {/* PESTAÑA: INICIO / IA */}
        {tab === 'inicio' && (
          <div className="card">
            <h2 className="card-title">🤖 Asistente IA</h2>
            <textarea
              rows="3"
              placeholder="¿En qué te ayudo hoy?"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button onClick={askAI} disabled={loadingAi}>
              {loadingAi ? 'Procesando...' : 'Consultar IA'}
            </button>
            {aiResponse && (
              <div className="ai-response-box">
                {aiResponse}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: ENFOQUE (POMODORO) */}
        {tab === 'pomodoro' && (
          <div className="card">
            <h2 className="card-title">⏱️ Temporizador Pomodoro</h2>
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? 'Pausar' : 'Iniciar Enfoque'}
              </button>
              <button className="btn-danger" onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }}>
                Reiniciar
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA: HÁBITOS */}
        {tab === 'habitos' && (
          <div className="card">
            <h2 className="card-title">⚡ Control de Hábitos</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Nuevo hábito..."
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                style={{ marginBottom: 0 }}
              />
              <button onClick={addHabit} style={{ width: 'auto' }}>Agregar</button>
            </div>
            {habits.map(h => (
              <div key={h.id} className={`item-row ${h.done ? 'done' : ''}`} onClick={() => toggleHabit(h.id)}>
                <span>{h.name}</span>
                <input type="checkbox" checked={h.done} readOnly />
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA: NOTAS */}
        {tab === 'notas' && (
          <div className="card">
            <h2 className="card-title">📝 Bloc de Memoria</h2>
            <input
              type="text"
              placeholder="Título de la nota"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <textarea
              rows="3"
              placeholder="Escribe tu nota aquí..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button onClick={addNote}>Guardar Nota</button>

            <div style={{ marginTop: '20px' }}>
              {savedNotes.map(n => (
                <div key={n.id} className="card" style={{ background: 'var(--bg-primary)', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', color: '#38bdf8' }}>{n.title}</h3>
                    <button className="btn-danger" onClick={() => deleteNote(n.id)} style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem' }}>
                      Eliminar
                    </button>
                  </div>
                  <p style={{ marginTop: '8px', fontSize: '0.88rem', color: '#cbd5e1' }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
          <span className="nav-icon">🤖</span>
          <span>IA</span>
        </button>
        <button className={`nav-item ${tab === 'pomodoro' ? 'active' : ''}`} onClick={() => setTab('pomodoro')}>
          <span className="nav-icon">⏱️</span>
          <span>Enfoque</span>
        </button>
        <button className={`nav-item ${tab === 'habitos' ? 'active' : ''}`} onClick={() => setTab('habitos')}>
          <span className="nav-icon">⚡</span>
          <span>Hábitos</span>
        </button>
        <button className={`nav-item ${tab === 'notas' ? 'active' : ''}`} onClick={() => setTab('notas')}>
          <span className="nav-icon">📝</span>
          <span>Notas</span>
        </button>
      </nav>
    </div>
  )
}
