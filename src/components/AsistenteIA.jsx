import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function AsistenteIA() {
  const [tema, setTema] = useState('');
  const [modo, setModo] = useState('explicacion');
  const [respuesta, setRespuesta] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  const procesarSolicitud = async () => {
    if (!tema.trim()) return;

    setLoading(true);
    setRespuesta('');

    let promptSystem = '';
    if (modo === 'explicacion') {
      promptSystem = `Eres un tutor académico experto y ultra directo. Explica el tema "${tema}" sin introducciones ni rodeos.
Estructura exactamente así:
**Sencilla:** Explicación clara y accesible para un principiante.
**Compleja:** Explicación técnica, rigurosa y profunda para nivel universitario.`;
    } else if (modo === 'resumen') {
      promptSystem = `Eres un tutor académico experto. Genera un resumen directo en viñetas del tema "${tema}" sin introducciones ni saludos.
Incluye únicamente los puntos clave fundamentales.`;
    } else if (modo === 'examen') {
      promptSystem = `Eres un tutor académico experto. Genera una prueba rápida sobre el tema "${tema}" sin introducciones.
1. Dos preguntas de opción múltiple.
2. Una pregunta de desarrollo.
3. Las respuestas correctas al final.`;
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptSystem }] }]
        })
      });

      const data = await res.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        setRespuesta(data.candidates[0].content.parts[0].text);
      } else if (data.error) {
        setRespuesta(`⚠️ Error: ${data.error.message}`);
      } else {
        setRespuesta('⚠️ No se pudo obtener respuesta.');
      }
    } catch (err) {
      console.error(err);
      setRespuesta('⚠️ Error de conexión con la API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: '8px' }}>🤖 Tutor IA Sabio</div>

      <input 
        type="text"
        placeholder="Ej: Pensamiento ancestral chino..."
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #334155',
          backgroundColor: '#0f172a',
          color: '#fff',
          fontSize: '0.9rem',
          marginBottom: '10px',
          boxSizing: 'border-box'
        }}
      />

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <button 
          onClick={() => setModo('explicacion')}
          style={{
            flex: 1, padding: '6px 4px', borderRadius: '6px', border: 'none',
            fontSize: '0.75rem', fontWeight: 'bold',
            background: modo === 'explicacion' ? '#818cf8' : '#334155', color: '#fff', cursor: 'pointer'
          }}
        >
          💡 Explicación
        </button>
        <button 
          onClick={() => setModo('resumen')}
          style={{
            flex: 1, padding: '6px 4px', borderRadius: '6px', border: 'none',
            fontSize: '0.75rem', fontWeight: 'bold',
            background: modo === 'resumen' ? '#818cf8' : '#334155', color: '#fff', cursor: 'pointer'
          }}
        >
          📌 Resumen
        </button>
        <button 
          onClick={() => setModo('examen')}
          style={{
            flex: 1, padding: '6px 4px', borderRadius: '6px', border: 'none',
            fontSize: '0.75rem', fontWeight: 'bold',
            background: modo === 'examen' ? '#818cf8' : '#334155', color: '#fff', cursor: 'pointer'
          }}
        >
          📝 Examen
        </button>
      </div>

      <button 
        onClick={procesarSolicitud}
        disabled={loading || !tema.trim()}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
          backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        {loading ? 'Consultando a la IA...' : '⚡ Preguntar al Sabio'}
      </button>

      {respuesta && (
        <div className="item-box" style={{ marginTop: '14px', fontSize: '0.85rem', lineHeight: '1.5' }}>
          <ReactMarkdown>{respuesta}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
