import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [lang, setLang] = useState('ES')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loginName, setLoginName] = useState('')
  const [loginEmail, setLoginEmail] = useState('')

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sb_user')
    return saved ? JSON.parse(saved) : null
  })

  const [tab, setTab] = useState('inicio')
  const [streak] = useState(1)
  const [studyMin, setStudyMin] = useState(0)
  const [focusLevel, setFocusLevel] = useState(100)

  const [tasks, setTasks] = useState([{ id: 1, text: 'Completar sesión de estudio', done: false }])
  const [newTask, setNewTask] = useState('')
  const [habits, setHabits] = useState(['Leer 20 min', 'Hacer ejercicio'])
  const [newHabit, setNewHabit] = useState('')

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [isPomoRunning, setIsPomoRunning] = useState(false)
  const [pomoSubject, setPomoSubject] = useState('')

  const [focusTime, setFocusTime] = useState(0)
  const [isFocusRunning, setIsFocusRunning] = useState(false)
  const [distractions, setDistractions] = useState([])
  const [distractionMin, setDistractionMin] = useState('')
  const [distractionCategory, setDistractionCategory] = useState('Redes sociales')

  const [memories, setMemories] = useState([])
  const [memoryType, setMemoryType] = useState('Meta')
  const [memoryText, setMemoryText] = useState('')

  const [studyTopic, setStudyTopic] = useState('')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    let timer = null
    if (isPomoRunning && pomodoroTime > 0) {
      timer = setInterval(() => setPomodoroTime((prev) => prev - 1), 1000)
    } else if (pomodoroTime === 0 && isPomoRunning) {
      setIsPomoRunning(false)
      setStudyMin((prev) => prev + 25)
      alert('¡Pomodoro completado!')
    }
    return () => clearInterval(timer)
  }, [isPomoRunning, pomodoroTime])

  useEffect(() => {
    let timer = null
    if (isFocusRunning) {
      timer = setInterval(() => setFocusTime((prev) => prev + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isFocusRunning])

  const handleGoogleLoginSubmit = (e) => {
    e.preventDefault()
    if (!loginName.trim()) return
    const userData = {
      name: loginName,
      email: loginEmail || `${loginName.toLowerCase().replace(/\s+/g, '')}@gmail.com`
    }
    setUser(userData)
    localStorage.setItem('sb_user', JSON.stringify(userData))
    setShowAuthModal(false)
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

  const handleAddHabit = () => {
    if (!newHabit.trim()) return
    setHabits([...habits, newHabit])
    setNewHabit('')
  }

  const handleAddDistraction = () => {
    if (!distractionMin) return
    const mins = parseInt(distractionMin) || 0
    setDistractions([...distractions, { category: distractionCategory, min: mins }])
    setDistractionMin('')
    setFocusLevel((prev) => Math.max(0, prev - 10))
  }

  const handleAddMemory = () => {
    if (!memoryText.trim()) return
    setMemories([...memories, { type: memoryType, text: memoryText }])
    setMemoryText('')
  }

  const askAI = async (promptText) => {
    if (!promptText.trim()) return
    setLoadingAI(true)
    setAiAnswer('Pensando...')
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=openai`)
      const text = await res.text()
      setAiAnswer(text)
    } catch {
      setAiAnswer('Error al conectar con la IA.')
    } finally {
      setLoadingAI(false)
    }
  }

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // --- VISTA DE LOGIN EMERGENT ---
  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="login-header-lang">
          <button className={`lang-btn ${lang === 'ES' ? 'active' : ''}`} onClick={() => setLang('ES')}>ES</button>
          <button className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
        </div>

        <div className="login-center-content">
          <svg className="tree-illustration" viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="50" rx="38" ry="34" fill="#00E676" opacity="0.3" />
            <ellipse cx="40" cy="42" rx="28" ry="26" fill="#00E676" opacity="0.6" />
            <ellipse cx="60" cy="42" rx="28" ry="26" fill="#00E676" opacity="0.6" />
            <ellipse cx="50" cy="35" rx="28" ry="26" fill="#00E676" />
            <path d="M48 65 H52 V82 H48 Z" fill="#052E16" />
            <ellipse cx="50" cy="83" rx="24" ry="3" fill="#052E16" />
          </svg>

          <h1 className="brand-title">Second Brain</h1>
          <p className="brand-subtitle">
            {lang === 'ES' ? 'Tu segundo cerebro, tranquilo y honesto.' : 'Your second brain, calm and honest.'}
          </p>
        </div>

        <div className="login-bottom-section">
          <span className="login-hint">
            {lang === 'ES' ? 'Inicia sesión para comenzar' : 'Sign in to get started'}
          </span>
          <button className="btn-google-login" onClick={() => setShowAuthModal(true)}>
            <span className="google-icon">G</span>
            {lang === 'ES' ? 'Continuar con Google' : 'Continue with Google'}
          </button>
        </div>

        {showAuthModal && (
          <div className="modal-overlay">
            <div className="card" style={{ width: '100%', maxWidth: '360px' }}>
              <h3 className="card-title" style={{ textAlign: 'center', marginBottom: '16px' }}>Cuenta de Google</h3>
              <form onSubmit={handleGoogleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  placeholder="Nombre de usuario" 
                  value={loginName} 
                  onChange={(e) => setLoginName(e.target.value)} 
                  required 
                />
                <input 
                  placeholder="Correo electrónico (@gmail.com)" 
                  type="email"
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                />
                <button type="submit" className="btn-green-main" style={{ width: '100%' }}>
                  Ingresar a Second Brain
                </button>
                <button type="button" className="btn-logout" style={{ width: '100%', marginTop: '4px' }} onClick={() => setShowAuthModal(false)}>
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <main className="container">
        {tab === 'inicio' && (
          <>
            <div className="card streak-hero">
              <div className="streak-number">{streak}</div>
              <div className="streak-sub">DÍAS DE RACHA</div>
              <div className="streak-footer">Tu árbol crece contigo</div>
            </div>

            <div className="ia-speech-bubble">
              <span style={{ color: '#00e676', fontSize: '1.2rem' }}>✦</span>
              <div>
                ¡Hola {user.name}! Tienes {tasks.filter(t => !t.done).length} tareas pendientes hoy.
              </div>
            </div>

            <div className="grid-2">
              <div className="metric-card">
                <span style={{ color: '#00e676' }}>📖</span>
                <div className="metric-val">{studyMin} <span>min</span></div>
                <div className="metric-desc">Estudio hoy</div>
              </div>
              <div className="metric-card">
                <span style={{ color: '#00e676' }}>⚡</span>
                <div className="metric-val">{focusLevel}%</div>
                <div className="metric-desc">Nivel de enfoque</div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Tareas pendientes</h3>
              <div className="input-row" style={{ marginBottom: '14px' }}>
                <input
                  placeholder="Añadir tarea"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="btn-icon-square" onClick={handleAddTask}>+</button>
              </div>
              {tasks.map(t => (
                <div key={t.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '8px 0' }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                    checked={t.done} 
                    onChange={() => toggleTask(t.id)}
                  />
                  <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#666' : '#fff' }}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'habitos' && (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hábitos</h2>
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🪴</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tu árbol crece contigo</div>
            </div>

            <div className="card">
              <h3 className="card-title">Mis Hábitos</h3>
              <ul style={{ listStyle: 'none', marginBottom: '15px' }}>
                {habits.map((h, i) => (
                  <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #222' }}>🌱 {h}</li>
                ))}
              </ul>
              <div className="input-row">
                <input 
                  placeholder="Ej: Leer 20 min" 
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                />
                <button className="btn-icon-square" onClick={handleAddHabit}>+</button>
              </div>
            </div>
          </>
        )}

        {tab === 'estudio' && (
          <>
            <div className="card timer-container">
              <div className="circle-timer">
                <div className="timer-time">{formatSeconds(pomodoroTime)}</div>
                <div className="timer-label">POMODORO</div>
              </div>
              <input 
                placeholder="Materia (ej: Matemáticas)" 
                value={pomoSubject}
                onChange={(e) => setPomoSubject(e.target.value)}
                style={{ textAlign: 'center', maxWidth: '80%', marginBottom: '15px' }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-green-main" onClick={() => setIsPomoRunning(!isPomoRunning)}>
                  {isPomoRunning ? '⏸ Pausar' : '▶ Iniciar'}
                </button>
                <button className="btn-logout" onClick={() => { setIsPomoRunning(false); setPomodoroTime(25 * 60); }}>
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Asistente de Estudio IA
              </h3>
              <input 
                placeholder="Tema a consultar (Ej: Tema de examen)" 
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                style={{ marginBottom: '12px' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI(`Dame un resumen rápido de: ${studyTopic}`)}>
                  📄 Resumen rápido
                </button>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI(`Explicación sencilla de: ${studyTopic}`)}>
                  💡 Explicación sencilla
                </button>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI(`Genera 3 preguntas tipo examen sobre: ${studyTopic}`)}>
                  ❓ Preguntas tipo examen
                </button>
              </div>
              {aiAnswer && (
                <div style={{ marginTop: '15px', padding: '12px', background: '#1a1a1a', borderRadius: '10px', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                  {aiAnswer}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'enfoque' && (
          <>
            <div className="card timer-container">
              <div className="circle-timer" style={{ borderColor: isFocusRunning ? '#00e676' : '#222' }}>
                <div className="timer-time">{formatSeconds(focusTime)}</div>
                <div className="timer-label">TIEMPO ENFOCADO</div>
              </div>
              <button className="btn-green-main" onClick={() => setIsFocusRunning(!isFocusRunning)}>
                {isFocusRunning ? '⏸ Detener' : '🌙 Iniciar Enfoque'}
              </button>
            </div>

            <div className="card">
              <h3 className="card-title">Registrar distracción</h3>
              <div className="input-row" style={{ marginBottom: '12px' }}>
                <input
                  placeholder="Minutos perdidos (ej: 15)"
                  type="number"
                  value={distractionMin}
                  onChange={(e) => setDistractionMin(e.target.value)}
                />
                <button className="btn-icon-square" onClick={handleAddDistraction}>+</button>
              </div>
              <div className="tags-row" style={{ marginBottom: '15px' }}>
                {['Redes sociales', 'YouTube', 'Videojuegos', 'Otro'].map((cat) => (
                  <button 
                    key={cat} 
                    className={`tag-btn ${distractionCategory === cat ? 'active' : ''}`}
                    onClick={() => setDistractionCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {distractions.reduce((acc, d) => acc + d.min, 0)} min perdidos
              </div>
              <ul style={{ listStyle: 'none', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {distractions.map((d, i) => (
                  <li key={i}>• {d.category}: {d.min} min</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {tab === 'perfil' && (
          <>
            <div className="card profile-header">
              <div className="user-info">
                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              <button className="btn-logout" onClick={handleLogout}>➔| Cerrar sesión</button>
            </div>

            <div className="card">
              <h3 className="card-title">Memoria inteligente</h3>
              <div className="tags-row" style={{ marginBottom: '12px' }}>
                {['Meta', 'Hábito', 'Materia difícil', 'Horario', 'Pensamiento'].map((t) => (
                  <button
                    key={t}
                    className={`tag-btn ${memoryType === t ? 'active' : ''}`}
                    onClick={() => setMemoryType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="input-row" style={{ marginBottom: '15px' }}>
                <input
                  placeholder="Escribe algo importante..."
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                />
                <button className="btn-icon-square" onClick={handleAddMemory}>+</button>
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.85rem' }}>
                {memories.map((m, i) => (
                  <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <strong style={{ color: '#00e676' }}>[{m.type}]</strong> {m.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="card-title">Consejo de la IA</h3>
              <input
                placeholder="Pregúntame lo que sea..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <button className="btn-green-main" style={{ width: '100%' }} onClick={() => askAI(aiQuestion)} disabled={loadingAI}>
                ✦ {loadingAI ? 'Consultando...' : 'Preguntar'}
              </button>
            </div>
          </>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
          <span>🏠</span>
          <span>Inicio</span>
        </button>
        <button className={`nav-item ${tab === 'habitos' ? 'active' : ''}`} onClick={() => setTab('habitos')}>
          <span>🍃</span>
          <span>Hábitos</span>
        </button>
        <button className={`nav-item ${tab === 'estudio' ? 'active' : ''}`} onClick={() => setTab('estudio')}>
          <span>📖</span>
          <span>Estudio</span>
        </button>
        <button className={`nav-item ${tab === 'enfoque' ? 'active' : ''}`} onClick={() => setTab('enfoque')}>
          <span>🌙</span>
          <span>Enfoque</span>
        </button>
        <button className={`nav-item ${tab === 'perfil' ? 'active' : ''}`} onClick={() => setTab('perfil')}>
          <span>👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
