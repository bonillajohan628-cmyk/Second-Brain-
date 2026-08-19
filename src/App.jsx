import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sb_user')
    return saved ? JSON.parse(saved) : null
  })

  const [tab, setTab] = useState('inicio')
  const [lang, setLang] = useState('ES')

  // Datos Inicio & Tareas
  const [streak] = useState(0)
  const [tasks, setTasks] = useState([{ id: 1, text: 'Comer', done: false }])
  const [newTask, setNewTask] = useState('')

  // Memoria
  const [memories, setMemories] = useState([])
  const [memoryType, setMemoryType] = useState('Meta')
  const [memoryText, setMemoryText] = useState('')

  // Hábitos
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  // Estudio & IA
  const [pomoTime, setPomoTime] = useState(25 * 60)
  const [isPomoRunning, setIsPomoRunning] = useState(false)
  const [pomoSubject, setPomoSubject] = useState('')
  const [aiTopic, setAiTopic] = useState('')
  const [aiPromptType, setAiPromptType] = useState('Resumen rápido')
  const [aiResponse, setAiResponse] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  // Enfoque & Sonido
  const [focusTime, setFocusTime] = useState(0)
  const [isFocusRunning, setIsFocusRunning] = useState(false)
  const [distractions, setDistractions] = useState([])
  const [distractionCategory, setDistractionCategory] = useState('Redes sociales')
  const [distractionMin, setDistractionMin] = useState('')
  const [ambientSound, setAmbientSound] = useState('none')

  // Timer Pomodoro
  useEffect(() => {
    let timer = null
    if (isPomoRunning && pomoTime > 0) {
      timer = setInterval(() => setPomoTime(prev => prev - 1), 1000)
    } else if (pomoTime === 0 && isPomoRunning) {
      setIsPomoRunning(false)
      alert('¡Tiempo de Pomodoro finalizado!')
    }
    return () => clearInterval(timer)
  }, [isPomoRunning, pomoTime])

  // Timer Enfoque
  useEffect(() => {
    let timer = null
    if (isFocusRunning) {
      timer = setInterval(() => setFocusTime(prev => prev + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isFocusRunning])

  const handleLogin = () => {
    const fakeUser = { name: 'Johan', email: 'johanpro1106@gmail.com' }
    setUser(fakeUser)
    localStorage.setItem('sb_user', JSON.stringify(fakeUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('sb_user')
  }

  const handleAddTask = () => {
    if (!newTask.trim()) return
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }])
    setNewTask('')
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const handleAddMemory = () => {
    if (!memoryText.trim()) return
    setMemories([...memories, { type: memoryType, text: memoryText }])
    setMemoryText('')
  }

  const handleAddHabit = () => {
    if (!newHabit.trim()) return
    setHabits([...habits, newHabit])
    setNewHabit('')
  }

  const handleAddDistraction = () => {
    if (!distractionMin) return
    setDistractions([...distractions, { category: distractionCategory, min: Number(distractionMin) }])
    setDistractionMin('')
  }

  const askAI = async (customPrompt) => {
    const query = customPrompt || `${aiPromptType}: ${aiTopic}`
    if (!query.trim()) return
    setLoadingAI(true)
    setAiResponse('⚡ Consultando...')
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(query)}?model=mistral`)
      if (res.ok) {
        setAiResponse(await res.text())
      } else {
        setAiResponse('Error al obtener respuesta de la IA.')
      }
    } catch (e) {
      setAiResponse('Error de conexión.')
    }
    setLoadingAI(false)
  }

  const formatMinSec = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Vista de Inicio de Sesión
  if (!user) {
    return (
      <div className="app-viewport">
        <div className="login-screen">
          <div className="tree-logo">🌳</div>
          <h1 className="login-title">Second Brain</h1>
          <p className="login-sub">Tu segundo cerebro, tranquilo y honesto.</p>
          
          <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '12px' }}>Inicia sesión para comenzar</p>
          <button className="btn-red-primary" onClick={handleLogin}>
            <span>G</span> Continuar con Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-viewport">
      {/* VISTA INICIO */}
      {tab === 'inicio' && (
        <>
          <div className="card streak-box">
            <div className="streak-val">{streak}</div>
            <div className="streak-lbl">DÍAS DE RACHA</div>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '8px' }}>Tu árbol crece contigo</p>
          </div>

          <div className="card" style={{ background: '#131519' }}>
            <p style={{ fontSize: '0.85rem', color: '#c9d1d9' }}>
              ✨ Hoy está en blanco total: cero racha, cero tareas, cero minutos. Buen momento para empezar de cero, sin drama.
            </p>
          </div>

          <div className="grid-2">
            <div className="metric-card">
              <div className="metric-val">📖 0 min</div>
              <div className="metric-lbl">Estudio hoy</div>
            </div>
            <div className="metric-card">
              <div className="metric-val">⚡ 0%</div>
              <div className="metric-lbl">Nivel de enfoque</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Tareas pendientes</div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input 
                placeholder="Añadir tarea" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button className="btn-inline-add" onClick={handleAddTask}>+</button>
            </div>
            {tasks.map(t => (
              <div key={t.id} className={`task-row ${t.done ? 'done' : ''}`}>
                <div className={`custom-checkbox ${t.done ? 'checked' : ''}`} onClick={() => toggleTask(t.id)}>
                  {t.done && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                </div>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Memoria inteligente</div>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '12px' }}>
              Guarda metas, hábitos, materias difíciles y pensamientos. La IA los recuerda.
            </p>
            <div className="chips-row">
              {['Meta', 'Hábito', 'Materia difícil', 'Horario', 'Pensamiento'].map(type => (
                <button 
                  key={type} 
                  className={`chip ${memoryType === type ? 'active' : ''}`}
                  onClick={() => setMemoryType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input 
                placeholder="Escribe algo importante..." 
                value={memoryText} 
                onChange={(e) => setMemoryText(e.target.value)} 
              />
              <button className="btn-inline-add" onClick={handleAddMemory}>+</button>
            </div>
            {memories.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#6e7681', textAlign: 'center' }}>Aún no has guardado nada. Empieza con una meta pequeña.</p>
            ) : (
              memories.map((m, i) => (
                <div key={i} style={{ fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #20232a' }}>
                  <strong>[{m.type}]</strong> {m.text}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* VISTA HÁBITOS */}
      {tab === 'habitos' && (
        <>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Hábitos</h2>
          <div className="card streak-box">
            <div style={{ fontSize: '3rem' }}>🌳</div>
            <p style={{ fontSize: '0.85rem', color: '#8b949e', marginTop: '8px' }}>Tu árbol crece contigo</p>
          </div>

          <div className="card">
            <div className="card-title">Progreso semanal</div>
            <div className="input-group" style={{ marginTop: '12px' }}>
              <input 
                placeholder="Ej: Leer 20 min" 
                value={newHabit} 
                onChange={(e) => setNewHabit(e.target.value)} 
              />
              <button className="btn-inline-add" onClick={handleAddHabit}>+</button>
            </div>
            {habits.map((h, i) => (
              <div key={i} className="task-row">
                <span>🌱 {h}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VISTA ESTUDIO */}
      {tab === 'estudio' && (
        <>
          <div className="card">
            <div className="timer-circle-container">
              <div className="timer-circle">
                <div className="timer-digits">{formatMinSec(pomoTime)}</div>
                <div className="timer-label">POMODORO</div>
              </div>
            </div>
            <input 
              placeholder="Ej: Matemáticas" 
              value={pomoSubject} 
              onChange={(e) => setPomoSubject(e.target.value)} 
              style={{ background: '#0f1013', border: '1px solid #262930', borderRadius: '12px', padding: '12px', color: '#fff', width: '100%', marginBottom: '12px' }}
            />
            <button className="btn-red-primary" onClick={() => setIsPomoRunning(!isPomoRunning)}>
              {isPomoRunning ? '⏸ Pausar' : '▶ Iniciar'}
            </button>
          </div>

          <div className="card">
            <div className="card-title">Resumen rápido · Explicación sencilla · Preguntas tipo examen</div>
            <input 
              placeholder="Ej: Ecuaciones lineales" 
              value={aiTopic} 
              onChange={(e) => setAiTopic(e.target.value)} 
              style={{ background: '#0f1013', border: '1px solid #262930', borderRadius: '12px', padding: '12px', color: '#fff', width: '100%', marginBottom: '12px' }}
            />
            <div className="chips-row">
              {[
                { label: '📄 Resumen rápido', value: 'Resumen rápido' },
                { label: '💡 Explicación sencilla', value: 'Explicación sencilla' },
                { label: '❓ Preguntas tipo examen', value: 'Preguntas tipo examen' }
              ].map(opt => (
                <button 
                  key={opt.value} 
                  className={`chip ${aiPromptType === opt.value ? 'active' : ''}`}
                  onClick={() => { setAiPromptType(opt.value); askAI(`${opt.value} de ${aiTopic}`); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {aiResponse && (
              <div style={{ marginTop: '12px', background: '#0f1013', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                {aiResponse}
              </div>
            )}
          </div>
        </>
      )}

      {/* VISTA ENFOQUE */}
      {tab === 'enfoque' && (
        <>
          <div className="card">
            <div className="timer-circle-container">
              <div className="timer-circle" style={{ borderColor: '#484f58' }}>
                <div className="timer-digits">{formatMinSec(focusTime)}</div>
                <div className="timer-label">TIEMPO</div>
              </div>
            </div>
            <button className="btn-red-primary" onClick={() => setIsFocusRunning(!isFocusRunning)} style={{ marginBottom: '16px' }}>
              {isFocusRunning ? '⏸ Detener' : '🌙 Iniciar'}
            </button>

            <div className="card-title" style={{ fontSize: '0.9rem' }}>Sonido de ambiente</div>
            <div className="chips-row">
              <button className={`chip ${ambientSound === 'rain' ? 'active' : ''}`} onClick={() => setAmbientSound('rain')}>🌧️ Lluvia</button>
              <button className={`chip ${ambientSound === 'lofi' ? 'active' : ''}`} onClick={() => setAmbientSound('lofi')}>🎧 Lo-Fi</button>
              <button className={`chip ${ambientSound === 'none' ? 'active' : ''}`} onClick={() => setAmbientSound('none')}>Apagar</button>
            </div>
            {ambientSound === 'rain' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" />}
            {ambientSound === 'lofi' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3" />}
          </div>

          <div className="card">
            <div className="card-title">Distracciones · Registrar distracción</div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <input 
                type="number" 
                placeholder="min (ej: 15)" 
                value={distractionMin} 
                onChange={(e) => setDistractionMin(e.target.value)} 
              />
              <button className="btn-inline-add" onClick={handleAddDistraction}>+</button>
            </div>
            <div className="chips-row">
              {['Redes sociales', 'YouTube', 'Videojuegos', 'Otro'].map(cat => (
                <button 
                  key={cat} 
                  className={`chip ${distractionCategory === cat ? 'active' : ''}`}
                  onClick={() => setDistractionCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              {distractions.reduce((acc, curr) => acc + curr.min, 0)} min
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>Todas las apps</div>
          </div>
        </>
      )}

      {/* VISTA PERFIL */}
      {tab === 'perfil' && (
        <>
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="tree-logo" style={{ width: '45px', height: '45px', fontSize: '1.2rem', margin: 0 }}>J</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{user.email}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ background: '#20232a', border: '1px solid #262930', color: '#f85149', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              🚪 Cerrar sesión
            </button>
          </div>

          <div className="card">
            <div className="card-title">Idioma</div>
            <div className="chips-row">
              <button className={`chip ${lang === 'ES' ? 'active' : ''}`} onClick={() => setLang('ES')}>ES</button>
              <button className={`chip ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Análisis semanal</div>
            <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '8px' }}>Estudio (min)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ff6b6b' }}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                <span key={i} style={{ fontSize: '0.75rem', color: '#8b949e' }}>{day}</span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* NAV INFERIOR EXACTO */}
      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
          <span>🏠</span>
          <span>Inicio</span>
        </button>
        <button className={`nav-btn ${tab === 'habitos' ? 'active' : ''}`} onClick={() => setTab('habitos')}>
          <span>🍃</span>
          <span>Hábitos</span>
        </button>
        <button className={`nav-btn ${tab === 'estudio' ? 'active' : ''}`} onClick={() => setTab('estudio')}>
          <span>📖</span>
          <span>Estudio</span>
        </button>
        <button className={`nav-btn ${tab === 'enfoque' ? 'active' : ''}`} onClick={() => setTab('enfoque')}>
          <span>🌙</span>
          <span>Enfoque</span>
        </button>
        <button className={`nav-btn ${tab === 'perfil' ? 'active' : ''}`} onClick={() => setTab('perfil')}>
          <span>👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
