import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [lang, setLang] = useState('ES')
  const [theme, setTheme] = useState('dark')
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
  const [reminderMinutes, setReminderMinutes] = useState('')

  const [studyTopic, setStudyTopic] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [ambientSound, setAmbientSound] = useState('none')

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

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.body.classList.toggle('light-mode', nextTheme === 'light')
  }

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
    setDistractions([...distractions, { category: distractionCategory, min: distractionMin }])
    setDistractionMin('')
  }

  const handleAddMemory = () => {
    if (!memoryText.trim()) return
    setMemories([...memories, { type: memoryType, text: memoryText }])
    setMemoryText('')
  }

  const askAI = async (promptText) => {
    if (!promptText || !promptText.trim()) return
    setLoadingAI(true)
    setAiAnswer('⚡ Consultando...')
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=mistral`)
      if (res.ok) {
        setAiAnswer(await res.text())
      } else {
        setAiAnswer('Ocurrió un error con el servicio de IA.')
      }
    } catch (e) {
      setAiAnswer('Error de conexión con la IA.')
    }
    setLoadingAI(false)
  }

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}>
        <div className="card">
          <h1 style={{ marginBottom: '10px', color: '#58a6ff' }}>Second Brain</h1>
          <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Tu espacio de organización personal.</p>
          <button className="btn-green-main" onClick={() => setShowAuthModal(true)}>Continuar con Google</button>
        </div>
        {showAuthModal && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>Ingresar datos</h3>
            <form onSubmit={handleGoogleLoginSubmit}>
              <input placeholder="Nombre" value={loginName} onChange={(e) => setLoginName(e.target.value)} required style={{ marginBottom: '10px' }} />
              <button type="submit" className="btn-green-main">Ingresar</button>
            </form>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <header className="top-header">
        <h2>Second Brain</h2>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="container">
        {tab === 'inicio' && (
          <>
            <div className="card streak-hero">
              <div className="streak-number">{streak}</div>
              <div className="streak-sub">DÍAS DE RACHA</div>
            </div>

            <div className="card">
              <h3>Tareas pendientes</h3>
              <div className="input-row">
                <input placeholder="Añadir tarea" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                <button className="btn-icon-square" onClick={handleAddTask}>+</button>
              </div>
              {tasks.map(t => (
                <div key={t.id} className={`task-item ${t.done ? 'done' : ''}`}>
                  <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                  <span>{t.text}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>Memoria / Recordatorios</h3>
              <div className="tags-row">
                {['Meta', 'Idea', 'Proyecto', 'Nota'].map(type => (
                  <button 
                    key={type} 
                    className={`tag-btn ${memoryType === type ? 'active' : ''}`}
                    onClick={() => setMemoryType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input 
                placeholder="Escribe lo que quieres recordar..." 
                value={memoryText} 
                onChange={(e) => setMemoryText(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <button className="btn-green-main" onClick={handleAddMemory}>Guardar Memoria</button>
              
              {memories.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  {memories.map((m, i) => (
                    <div key={i} style={{ fontSize: '0.85rem', padding: '6px 0', borderBottom: '1px solid #21262d' }}>
                      <strong>[{m.type}]</strong> {m.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'habitos' && (
          <div className="card">
            <h3>Mis Hábitos</h3>
            <div className="input-row">
              <input placeholder="Nuevo hábito" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} />
              <button className="btn-icon-square" onClick={handleAddHabit}>+</button>
            </div>
            {habits.map((h, i) => (
              <div key={i} className="task-item">
                <span>🌱 {h}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'estudio' && (
          <>
            <div className="card timer-container">
              <h3>Temporizador Pomodoro</h3>
              <div className="circle-timer">
                <div className="timer-time">{formatSeconds(pomodoroTime)}</div>
              </div>
              <button className="btn-green-main" onClick={() => setIsPomoRunning(!isPomoRunning)}>
                {isPomoRunning ? '⏸ Pausar' : '▶ Iniciar Pomodoro'}
              </button>
            </div>

            <div className="card">
              <h3>Tutor de IA</h3>
              <input 
                placeholder="Escribe un tema o pregunta..." 
                value={studyTopic} 
                onChange={(e) => setStudyTopic(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <button className="btn-green-main" onClick={() => askAI(studyTopic)} disabled={loadingAI}>
                {loadingAI ? 'Consultando...' : 'Preguntar a la IA'}
              </button>
              {aiAnswer && (
                <div style={{ marginTop: '15px', background: '#0d1117', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                  {aiAnswer}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'enfoque' && (
          <>
            <div className="card timer-container">
              <h3>Modo Enfoque</h3>
              <div className="circle-timer">
                <div className="timer-time">{formatSeconds(focusTime)}</div>
              </div>
              <button className="btn-green-main" onClick={() => setIsFocusRunning(!isFocusRunning)} style={{ marginBottom: '15px' }}>
                {isFocusRunning ? '⏸ Detener Enfoque' : '🌙 Iniciar Enfoque'}
              </button>

              <h3>Sonido de Ambiente</h3>
              <div className="tags-row" style={{ justifyContent: 'center' }}>
                <button className={`tag-btn ${ambientSound === 'rain' ? 'active' : ''}`} onClick={() => setAmbientSound('rain')}>🌧️ Lluvia</button>
                <button className={`tag-btn ${ambientSound === 'lofi' ? 'active' : ''}`} onClick={() => setAmbientSound('lofi')}>🎧 Lo-Fi</button>
                <button className={`tag-btn ${ambientSound === 'none' ? 'active' : ''}`} onClick={() => setAmbientSound('none')}>Apagar</button>
              </div>

              {ambientSound === 'rain' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" />}
              {ambientSound === 'lofi' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3" />}
            </div>

            <div className="card">
              <h3>Registro de Distracciones</h3>
              <div className="tags-row">
                {['Redes sociales', 'YouTube', 'Videojuegos', 'Otro'].map(cat => (
                  <button 
                    key={cat} 
                    className={`tag-btn ${distractionCategory === cat ? 'active' : ''}`}
                    onClick={() => setDistractionCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="input-row">
                <input 
                  type="number" 
                  placeholder="Minutos perdidos" 
                  value={distractionMin} 
                  onChange={(e) => setDistractionMin(e.target.value)} 
                />
                <button className="btn-icon-square" onClick={handleAddDistraction}>+</button>
              </div>
              {distractions.map((d, i) => (
                <div key={i} style={{ fontSize: '0.85rem', padding: '4px 0' }}>
                  ⚠️ {d.category}: {d.min} min
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'perfil' && (
          <div className="card">
            <h3>Perfil del Usuario</h3>
            <p style={{ margin: '8px 0', fontSize: '0.95rem' }}><strong>Nombre:</strong> {user.name}</p>
            <p style={{ marginBottom: '16px', fontSize: '0.95rem', opacity: 0.8 }}><strong>Email:</strong> {user.email}</p>
            <button className="btn-green-main" onClick={handleLogout} style={{ background: '#da3633' }}>Cerrar sesión</button>
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
          🏠
          <span>Inicio</span>
        </button>
        <button className={`nav-item ${tab === 'habitos' ? 'active' : ''}`} onClick={() => setTab('habitos')}>
          🍃
          <span>Hábitos</span>
        </button>
        <button className={`nav-item ${tab === 'estudio' ? 'active' : ''}`} onClick={() => setTab('estudio')}>
          📖
          <span>Estudio</span>
        </button>
        <button className={`nav-item ${tab === 'enfoque' ? 'active' : ''}`} onClick={() => setTab('enfoque')}>
          🌙
          <span>Enfoque</span>
        </button>
        <button className={`nav-item ${tab === 'perfil' ? 'active' : ''}`} onClick={() => setTab('perfil')}>
          👤
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  )
}
