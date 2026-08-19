import React, { useState } from 'react'
import './App.css'

export default function App() {
  const [tab, setTab] = useState('inicio')
  const [lang, setLang] = useState('ES')

  const [streak] = useState(0)
  const [studyMin] = useState(0)
  const [focusLevel] = useState(0)
  const [tasks, setTasks] = useState([{ id: 1, text: 'Comer', done: false }])
  const [newTask, setNewTask] = useState('')

  const [timerTime] = useState(25)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [distractionMin, setDistractionMin] = useState('')

  const [memoryType, setMemoryType] = useState('Meta')
  const [memoryText, setMemoryText] = useState('')
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')

  const handleAddTask = () => {
    if (!newTask.trim()) return
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }])
    setNewTask('')
  }

  const askAI = async (prompt) => {
    if (!prompt.trim()) return
    setAiAnswer('Pensando...')
    try {
      const res = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt))
      const text = await res.text()
      setAiAnswer(text)
    } catch {
      setAiAnswer('Error de conexión.')
    }
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
                Hoy está en blanco total: cero racha, cero tareas, cero minutos. Buen momento para empezar de cero, sin drama.
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
                  <input type="checkbox" style={{ width: '20px', height: '20px' }} readOnly checked={t.done} />
                  <span>{t.text}</span>
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
              <h3 className="card-title">Progreso semanal</h3>
              <div className="days-grid" style={{ marginTop: '15px' }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="day-col">
                    <span className="day-text">{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', margin: '15px 0' }}>
                🌱 Nuevo hábito
              </div>
              <div className="input-row">
                <input placeholder="Ej: Leer 20 min" />
                <button className="btn-icon-square">+</button>
              </div>
            </div>
          </>
        )}

        {tab === 'estudio' && (
          <>
            <div className="card timer-container">
              <div className="circle-timer">
                <div className="timer-time">{timerTime}:00</div>
                <div className="timer-label">POMODORO</div>
              </div>
              <input placeholder="Ej: Matemáticas" style={{ textAlign: 'center', maxWidth: '80%', marginBottom: '15px' }} />
              <button className="btn-green-main" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                ▶ {isTimerRunning ? 'Pausar' : 'Iniciar'}
              </button>
            </div>

            <div className="card">
              <h3 className="card-title" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Resumen rápido • Explicación sencilla • Preguntas tipo examen
              </h3>
              <input placeholder="Ej: Ecuaciones lineales" style={{ marginBottom: '12px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI('Dame un resumen rápido de ecuaciones lineales')}>
                  📄 Resumen rápido
                </button>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI('Dame una explicación sencilla de ecuaciones lineales')}>
                  💡 Explicación sencilla
                </button>
                <button className="tag-btn" style={{ justifyContent: 'flex-start' }} onClick={() => askAI('Genera preguntas tipo examen sobre ecuaciones lineales')}>
                  ❓ Preguntas tipo examen
                </button>
              </div>
              {aiAnswer && <div style={{ marginTop: '15px', padding: '12px', background: '#1a1a1a', borderRadius: '10px', fontSize: '0.85rem' }}>{aiAnswer}</div>}
            </div>
          </>
        )}

        {tab === 'enfoque' && (
          <>
            <div className="card timer-container">
              <div className="circle-timer" style={{ borderColor: '#222' }}>
                <div className="timer-time">00:00</div>
                <div className="timer-label">TIEMPO</div>
              </div>
              <button className="btn-green-main">🌙 Iniciar</button>
            </div>

            <div className="card">
              <h3 className="card-title">Distracciones • Registrar distracción</h3>
              <input
                placeholder="min (ej: 15)"
                value={distractionMin}
                onChange={(e) => setDistractionMin(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <div className="tags-row" style={{ marginBottom: '15px' }}>
                <button className="tag-btn">💬 Redes sociales</button>
                <button className="tag-btn">▶ YouTube</button>
                <button className="tag-btn">🎮 Videojuegos</button>
                <button className="tag-btn">••• Otro</button>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>0 min</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Todas las apps</div>
            </div>
          </>
        )}

        {tab === 'perfil' && (
          <>
            <div className="card profile-header">
              <div className="user-info">
                <div className="avatar">J</div>
                <div>
                  <div className="user-name">Johan</div>
                  <div className="user-email">johanpro1106@gmail.com</div>
                </div>
              </div>
              <button className="btn-logout">➔| Cerrar sesión</button>
            </div>

            <div className="card">
              <h3 className="card-title">Idioma</h3>
              <div className="tags-row">
                <button className={`tag-btn ${lang === 'ES' ? 'active' : ''}`} onClick={() => setLang('ES')}>ES</button>
                <button className={`tag-btn ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Análisis semanal</h3>
              <div className="chart-section">
                <div className="chart-label">Estudio (min)</div>
                <div className="days-grid">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={i} className="day-col">
                      <div className="bar-line green"></div>
                      <span className="day-text">{d}</span>
                    </div>
                  ))}
                </div>

                <div className="chart-label">Enfoque (min)</div>
                <div className="days-grid">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={i} className="day-col">
                      <div className="bar-line blue"></div>
                      <span className="day-text">{d}</span>
                    </div>
                  ))}
                </div>

                <div className="chart-label">Hábitos</div>
                <div className="days-grid">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                    <div key={i} className="day-col">
                      <div className="bar-line green"></div>
                      <span className="day-text">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Memoria inteligente</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Guarda metas, hábitos, materias difíciles y pensamientos. La IA los recuerda.
              </p>
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
                <button className="btn-icon-square">+</button>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Aún no has guardado nada. Empieza con una meta pequeña.
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Consejo de la IA</h3>
              <input
                placeholder="Pregúntame lo que sea..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <button className="btn-green-main" style={{ width: '100%' }} onClick={() => askAI(aiQuestion)}>
                ✦ Preguntar
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
