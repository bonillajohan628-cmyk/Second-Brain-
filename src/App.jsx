import React, { useState, useEffect } from 'react'

export default function App() {
  const [tab, setTab] = useState('inicio')

  // Respaldo
  const [backupStatus, setBackupStatus] = useState('')

  // Pomodoro
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  // IA Libre (Sin API Key)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)

  // Decidir
  const [pros, setPros] = useState(() => JSON.parse(localStorage.getItem('sb_pros')) || [])
  const [contras, setContras] = useState(() => JSON.parse(localStorage.getItem('sb_contras')) || [])
  const [newPro, setNewPro] = useState('')
  const [newContra, setNewContra] = useState('')

  // Hábitos
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('sb_habits')) || [
    { id: 1, name: 'Leer 20 mins', done: false },
    { id: 2, name: 'Hacer ejercicio', done: false }
  ])
  const [newHabit, setNewHabit] = useState('')

  // Bloc de Memoria
  const [savedNotes, setSavedNotes] = useState(() => JSON.parse(localStorage.getItem('sb_notes_list')) || [])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  // Persistencia
  useEffect(() => { localStorage.setItem('sb_pros', JSON.stringify(pros)) }, [pros])
  useEffect(() => { localStorage.setItem('sb_contras', JSON.stringify(contras)) }, [contras])
  useEffect(() => { localStorage.setItem('sb_habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('sb_notes_list', JSON.stringify(savedNotes)) }, [savedNotes])

  // Timer
  useEffect(() => {
    let timer = null
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Consulta IA
  const askAI = async () => {
    if (!aiPrompt.trim()) return
    setLoadingAi(true)
    setAiResponse('Pensando respuesta...')
    try {
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: aiPrompt }],
          model: 'openai'
        })
      })
      const text = await res.text()
      setAiResponse(text || 'No se obtuvo respuesta.')
    } catch (err) {
      setAiResponse('Error de conexión con la IA.')
    }
    setLoadingAi(false)
  }

  const saveAiToNotes = () => {
    if (!aiResponse || aiResponse.startsWith('Error')) return
    const newEntry = {
      id: Date.now(),
      title: `Consulta IA: ${aiPrompt.slice(0, 20)}...`,
      content: aiResponse,
      date: new Date().toLocaleDateString()
    }
    setSavedNotes([newEntry, ...savedNotes])
    alert('¡Respuesta de la IA guardada en Memoria!')
  }

  // Bloc de Memoria
  const saveNote = () => {
    if (!noteTitle.trim() && !noteContent.trim()) return
    const newEntry = {
      id: Date.now(),
      title: noteTitle || 'Nota rápida',
      content: noteContent,
      date: new Date().toLocaleDateString()
    }
    setSavedNotes([newEntry, ...savedNotes])
    setNoteTitle('')
    setNoteContent('')
  }

  const deleteNote = (id) => {
    setSavedNotes(savedNotes.filter(n => n.id !== id))
  }

  // Backup
  const exportData = () => {
    const data = { ...localStorage }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `second_brain_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setBackupStatus('¡Copia descargada!')
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        Object.keys(data).forEach(key => localStorage.setItem(key, data[key]))
        setBackupStatus('¡Restaurado! Recargando...')
        setTimeout(() => window.location.reload(), 1000)
      } catch (err) {
        setBackupStatus('Error al leer el archivo.')
      }
    }
    reader.readAsText(file)
  }

  // Gestores de lista
  const addHabit = () => { if (newHabit.trim()) { setHabits([...habits, { id: Date.now(), name: newHabit, done: false }]); setNewHabit('') } }
  const removeHabit = (id) => setHabits(habits.filter(h => h.id !== id))
  const toggleHabit = (id) => setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h))

  const addPro = () => { if (newPro.trim()) { setPros([...pros, newPro]); setNewPro('') } }
  const removePro = (index) => setPros(pros.filter((_, i) => i !== index))

  const addContra = () => { if (newContra.trim()) { setContras([...contras, newContra]); setNewContra('') } }
  const removeContra = (index) => setContras(contras.filter((_, i) => i !== index))

  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">Second Brain</h1>
      </header>

      <main className="main-content">
        {tab === 'inicio' && (
          <div>
            <div className="card">
              <h2 className="card-title">🧠 Bienvenido</h2>
              <p className="card-subtitle">Tu centro de control offline y privado.</p>
            </div>
            <div className="card">
              <h3 className="card-title">💾 Respaldo y Datos</h3>
              <p className="card-subtitle">Exporta o restaura todo en JSON.</p>
              <div className="button-group">
                <button onClick={exportData} className="btn-primary">Descargar Copia</button>
                <label className="btn-secondary" style={{ textAlign: 'center', cursor: 'pointer' }}>
                  Restaurar Copia
                  <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
                </label>
              </div>
              {backupStatus && <p style={{ marginTop: '12px', fontSize: '12px', color: '#818cf8' }}>{backupStatus}</p>}
            </div>
          </div>
        )}

        {tab === 'estudio' && (
          <div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h2 className="card-title">⏱️ Pomodoro</h2>
              <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '16px 0', color: '#818cf8' }}>
                {formatTime(timeLeft)}
              </div>
              <div className="button-group">
                <button onClick={() => setIsRunning(!isRunning)} className="btn-primary">
                  {isRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button onClick={() => { setIsRunning(false); setTimeLeft(25 * 60) }} className="btn-secondary">
                  Reiniciar
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">🤖 Asistente de Estudio (IA)</h3>
              <p className="card-subtitle">Haz preguntas de matemáticas, conceptos o resúmenes.</p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej: Resuelve 2x + 5 = 15 o explícame la fotosíntesis..."
                style={{ width: '100%', height: '70px', background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '8px', marginTop: '10px' }}
              />
              <button onClick={askAI} disabled={loadingAi} className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                {loadingAi ? 'Procesando...' : 'Preguntar a la IA'}
              </button>
              {aiResponse && (
                <div style={{ marginTop: '12px', padding: '10px', background: '#090d16', borderRadius: '8px', fontSize: '13px', whiteSpace: 'pre-wrap', border: '1px solid #1e293b' }}>
                  {aiResponse}
                  {!loadingAi && !aiResponse.startsWith('Error') && (
                    <button onClick={saveAiToNotes} className="btn-secondary" style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}>
                      📌 Guardar respuesta en Memoria
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'decidir' && (
          <div className="card">
            <h2 className="card-title">⚖️ Matriz de Decisiones</h2>

            <div style={{ marginTop: '16px' }}>
              <h4 style={{ color: '#4ade80', marginBottom: '8px' }}>Pros</h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newPro}
                  onChange={(e) => setNewPro(e.target.value)}
                  placeholder="Punto a favor..."
                  style={{ flex: 1, background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
                />
                <button onClick={addPro} className="btn-primary" style={{ padding: '8px 16px' }}>+</button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {pros.map((p, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', background: '#090d16', padding: '8px 12px', borderRadius: '8px' }}>
                    <span style={{ color: '#cbd5e1' }}>✓ {p}</span>
                    <button onClick={() => removePro(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#f87171', marginBottom: '8px' }}>Contras</h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newContra}
                  onChange={(e) => setNewContra(e.target.value)}
                  placeholder="Punto en contra..."
                  style={{ flex: 1, background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
                />
                <button onClick={addContra} className="btn-primary" style={{ padding: '8px 16px' }}>+</button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {contras.map((c, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0', background: '#090d16', padding: '8px 12px', borderRadius: '8px' }}>
                    <span style={{ color: '#cbd5e1' }}>✗ {c}</span>
                    <button onClick={() => removeContra(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'habitos' && (
          <div className="card">
            <h2 className="card-title">🔥 Tracker de Hábitos</h2>
            <div style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Nuevo hábito..."
                style={{ flex: 1, background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
              />
              <button onClick={addHabit} className="btn-primary" style={{ padding: '8px 16px' }}>Añadir</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {habits.map(h => (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: '#090d16',
                    borderRadius: '10px',
                    border: '1px solid #1e293b'
                  }}
                >
                  <div onClick={() => toggleHabit(h.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer', textDecoration: h.done ? 'line-through' : 'none', opacity: h.done ? 0.5 : 1 }}>
                    <input type="checkbox" checked={h.done} readOnly />
                    <span>{h.name}</span>
                  </div>
                  <button onClick={() => removeHabit(h.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'memoria' && (
          <div>
            <div className="card">
              <h2 className="card-title">📝 Crear Nota Manual</h2>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Título..."
                style={{ width: '100%', background: '#090d16', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '8px', marginTop: '12px' }}
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Escribe el contenido..."
                style={{ width: '100%', height: '80px', marginTop: '8px', background: '#090d16', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
              />
              <button onClick={saveNote} className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                💾 Guardar Nota
              </button>
            </div>

            <div className="card">
              <h3 className="card-title">📚 Tus Notas Guardadas ({savedNotes.length})</h3>
              {savedNotes.length === 0 ? (
                <p className="card-subtitle" style={{ marginTop: '8px' }}>No hay notas guardadas aún.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                  {savedNotes.map(n => (
                    <div key={n.id} style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ color: '#818cf8', fontSize: '15px' }}>{n.title}</strong>
                        <button onClick={() => deleteNote(n.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                      </div>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{n.content}</p>
                      <span style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', display: 'block' }}>{n.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'estudio', label: 'Estudio', icon: '⏱️' },
          { id: 'decidir', label: 'Decidir', icon: '⚖️' },
          { id: 'habitos', label: 'Hábitos', icon: '🔥' },
          { id: 'memoria', label: 'Memoria', icon: '📝' },
        ].map(({ id, label, icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`nav-item ${tab === id ? 'active' : ''}`}>
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
