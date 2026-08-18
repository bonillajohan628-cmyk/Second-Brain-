import React, { useState } from 'react';
import { useDecision } from '../hooks/useDecision';

export default function Decidir() {
  const [situation, setSituation] = useState('');
  const [options, setOptions] = useState('');
  const { decidir } = useDecision();

  const handleDecidir = async () => {
    if (!situation || !options) return;
    await decidir({ situation, options: options.split(',') });
    setSituation('');
    setOptions('');
    window.location.reload();
  };

  return (
    <div className="card">
      <div className="card-title">🤔 Tomar una decisión</div>
      <input 
        placeholder="¿Qué debo decidir?" 
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <input 
        placeholder="Opciones (separadas por coma)" 
        value={options}
        onChange={(e) => setOptions(e.target.value)}
        style={{ marginBottom: '12px' }}
      />
      <button onClick={handleDecidir} className="btn-primary">
        ¡Decidir!
      </button>
    </div>
  );
}
