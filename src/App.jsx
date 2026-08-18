import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('inicio')

  // Rachas y Árbol de Crecimiento
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('sb_streak')) || 3)
  const [treeExp, setTreeExp] = useState(() => Number(localStorage.getItem('sb_exp')) || 40)

  // Pomodoro
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  // IA
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)

  // Hábitos y Notas
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('sb_habits')) || [
    { id: 1, name: 'Leer 20 mins', done: true },
    { id: 2, name: 'Hacer ejercicio', done: false }
  ])
  const [newHabit, setNewHabit] = useState('')
  const [savedNotes, setSavedNotes] = useState(() => JSON.parse(localStorage.getItem('sb_notes')) || [])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  useEffect(() => { localStorage.setItem('sb_streak', streak) }, [streak])
  useEffect(() => { localStorage.setItem('sb_exp', treeExp) }, [treeExp])
  useEffect(() => { localStorage.setItem('sb_habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('sb_notes', JSON.stringify(savedNotes)) }, [savedNotes])

  // Lógica del Árbol según Experiencia
  const getTreeStage = () => {
    if (treeExp < 30) return { icon: '🌱', level: 'Brote' }
    if (treeExp < 70) return { icon: '🌿', level: 'Planta Joven' }
    if (treeExp < 120) return { icon: '🪴', level: 'Arbusto' }
    return { icon: '🌳', level: 'Árbol Sabio' }
  }

  const askAI = async (promptToSend) => {
    const query = promptToSend || aiPrompt
    if (!query.trim()) return
    setLoadingAi(true)
    setAiResponse('Pensando respuesta...')
    try {
      const res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(query))
      const data = await res.text()
      setAiResponse(data)
    } catch (error) {
      setAiResponse('Error al conectar con la IA.')
    } finally {
      setLoadingAi(false)
    }
  }

  const toggleHabit = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const updatedDone = !h.done
        if (updatedDone) setTreeExp(prev => prev + 15)
        return { ...h, done: updatedDone }
      }
      return h
    }))
  }

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">🧠 Second Brain</h1>
        <div className="streak-badge">🔥 {streak} días Racha</div>
      </header>

      <main className="container">
        {/* VISTA PRINCIPAL (IA + ÁRBOL) */}
        {tab === 'inicio' && (
          <>
            {/* Árbol de Crecimiento para llenar espacio visual */}
            <div className="card tree-container">
              <div className="card-title">
                <span>Tu Árbol Mental</span>
                <span className="tree-level">{getTreeStage().level}</span>
              </div>
              <div className="tree-icon">{getTreeStage().icon}</div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${Math.min(treeExp, 100)}%` }}></div>
              </div>
            </div>

            {/* Asistente IA con atajos rápidos */}
            <div className="card">
              <h2 className="card-title">🤖 Asistente IA</h2>
              
              <div className="chips-grid">
                <button type="button" className="chip" onClick={() => { setAiPrompt('Resume mi día'); askAI('Resume mi día'); }}>
                  💡 Resume mi día
                </button>
                <button type="button" className="chip" onClick={() => { setAiPrompt('Dame un consejo de enfoque'); askAI('Dame un consejo de enfoque'); }}>
                  🎯 Tip de Enfoque
                </button>
              </div>

              <textarea
                rows="3"
                placeholder="¿En qué te ayudo hoy?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button onClick={() => askAI()} disabled={loadingAi}>
                {loadingAi ? 'Procesando...' : 'Consultar IA'}
              </button>
              {aiResponse && <div className="ai-response-box">{aiResponse}</div>}
            </div>
          </>
        )}

        {/* RESTO DE PESTAÑAS */}
        {tab === 'pomodoro' && (
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 className="card-title">⏱️ Pomodoro</h2>
            <div style={{ fontSize: '3rem', margin: '15px 0', color: '#38bdf8' }}>
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pausar' : 'Iniciar'}</button>
          </div>
        )}

        {tab === 'habitos' && (
          <div className="card">
            <h2 className="card-title">⚡ Hábitos (+EXP para tu árbol)</h2>
            {habits.map(h => (
              <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #232d42' }} onClick={() => toggleHabit(h.id)}>
                <span style={{ textDecoration: h.done ? 'line-through' : 'none', opacity: h.done ? 0.6 : 1 }}>{h.name}</span>
                <input type="checkbox" checked={h.done} readOnly />
              </div>
            ))}
          </div>
        )}

        {tab === 'notas' && (
          <div className="card">
            <h2 className="card-title">📝 Notas Rápidas</h2>
            <input placeholder="Título..." value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
            <textarea placeholder="Contenido..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
            <button onClick={() => {
              if (!noteTitle.trim()) return;
              setSavedNotes([...savedNotes, { id: Date.now(), title: noteTitle, content: noteContent }]);
              setNoteTitle(''); setNoteContent('');
            }}>Guardar Nota</button>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
          <span>🤖</span><span>IA</span>
        </button>
        <button className={`nav-item ${tab === 'pomodoro' ? 'active' : ''}`} onClick={() => setTab('pomodoro')}>
          <span>⏱️</span><span>Enfoque</span>
        </button>
        <button className={`nav-item ${tab === 'habitos' ? 'active' : ''}`} onClick={() => setTab('habitos')}>
          <span>⚡</span><span>Hábitos</span>
        </button>
        <button className={`nav-item ${tab === 'notas' ? 'active' : ''}`} onClick={() => setTab('notas')}>
          <span>📝</span><span>Notas</span>
        </button>
      </nav>
    </div>
  )
}
