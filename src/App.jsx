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
    const userData = { name: loginName, email: loginEmail || `${loginName.toLowerCase().replace(/\s+/g, '')}@gmail.com` }
    setUser(userData)
    localStorage.setItem('sb_user', JSON.stringify(userData))
    setShowAuthModal(false)
  }

  const handleLogout = () => { setUser(null); localStorage.removeItem('sb_user') }
  const handleAddTask = () => { setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]); setNewTask('') }
  const toggleTask = (id) => { setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)) }
  const handleAddHabit = () => { setHabits([...habits, newHabit]); setNewHabit('') }
  const handleAddDistraction = () => { 
    if(!distractionMin) return
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
    setAiAnswer('⚡ Consultando a la IA...')
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=mistral`)
      if (res.ok) setAiAnswer(await res.text())
    } catch (e) { setAiAnswer('Error al conectar') }
    setLoadingAI(false)
  }

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="login-center-content">
          <h1>Second Brain</h1>
          <button className="btn-google-login" onClick={() => setShowAuthModal(true)}>Continuar con Google</button>
        </div>
        {showAuthModal && (
          <div className="modal-overlay">
            <div className="card">
              <h3>Tu nombre</h3>
              <form onSubmit={handleGoogleLoginSubmit}>
                <input placeholder="Nombre" value={loginName} onChange={(e) => setLoginName(e.target.value)} required />
                <button type="submit" className="btn-green-main">Ingresar</button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }
  return (
    <div>
      <button onClick={toggleTheme} style={{position: 'fixed', top: 15, right: 15, zIndex: 999}}>{theme === 'dark' ? '☀️' : '🌙'}</button>
      <main className="container">
        {tab === 'inicio' && (
          <>
            <div className="card streak-hero"><div>{streak} DÍAS DE RACHA</div></div>
            <div className="card"><h3>Tareas</h3><input value={newTask} onChange={(e) => setNewTask(e.target.value)} /><button onClick={handleAddTask}>+</button>
              {tasks.map(t => <div key={t.id}><input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} /> {t.text}</div>)}
            </div>
            <div className="card"><h3>Memoria</h3>
              <input value={memoryText} onChange={(e) => setMemoryText(e.target.value)} placeholder="Escribe..." />
              <button onClick={handleAddMemory}>Guardar</button>
              {memories.map((m, i) => <div key={i}>[{m.type}] {m.text}</div>)}
            </div>
          </>
        )}
        {tab === 'habitos' && (
          <div className="card"><h3>Hábitos</h3>
            {habits.map((h, i) => <div key={i}>🌱 {h}</div>)}
            <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} /><button onClick={handleAddHabit}>+</button>
          </div>
        )}
        {tab === 'estudio' && (
          <div className="card">
            <h3>Pomodoro</h3>
            <div className="timer-time">{formatSeconds(pomodoroTime)}</div>
            <button onClick={() => setIsPomoRunning(!isPomoRunning)}>{isPomoRunning ? 'Pausar' : 'Iniciar'}</button>
            <input placeholder="Tema IA" value={studyTopic} onChange={(e) => setStudyTopic(e.target.value)} />
            <button onClick={() => askAI(studyTopic)} disabled={loadingAI}>Preguntar IA</button>
            {aiAnswer && <div className="card">{aiAnswer}</div>}
          </div>
        )}
        {tab === 'enfoque' && (
          <div className="card">
            <h3>Enfoque</h3>
            <div className="timer-time">{formatSeconds(focusTime)}</div>
            <button onClick={() => setIsFocusRunning(!isFocusRunning)}>{isFocusRunning ? 'Detener' : 'Iniciar'}</button>
            <div>
              <button onClick={() => setAmbientSound('rain')}>🌧️ Lluvia</button>
              <button onClick={() => setAmbientSound('lofi')}>🎧 Lo-Fi</button>
            </div>
            {ambientSound === 'rain' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3" />}
            {ambientSound === 'lofi' && <audio autoPlay loop src="https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3" />}
            <input type="number" placeholder="Minutos perdidos" value={distractionMin} onChange={(e) => setDistractionMin(e.target.value)} />
            <button onClick={handleAddDistraction}>Registrar Distracción</button>
          </div>
        )}
        {tab === 'perfil' && <div className="card"><h3>{user.name}</h3><button onClick={handleLogout}>Cerrar sesión</button></div>}
      </main>
      <nav className="bottom-nav">
        <button onClick={() => setTab('inicio')}>🏠</button><button onClick={() => setTab('habitos')}>🍃</button>
        <button onClick={() => setTab('estudio')}>📖</button><button onClick={() => setTab('enfoque')}>🌙</button>
        <button onClick={() => setTab('perfil')}>👤</button>
      </nav>
    </div>
  )
}
