import { useState, useEffect } from 'react';
import { detectarPatrones } from '../brain/patternEngine';

export function usePatterns() {
  const [patrones, setPatrones] = useState([]);
  const [loading, setLoading] = useState(true);

  const actualizarPatrones = async () => {
    setLoading(true);
    const detectados = await detectarPatrones();
    setPatrones(detectados);
    setLoading(false);
  };

  useEffect(() => {
    actualizarPatrones();
  }, []);

  return { patrones, loading, actualizarPatrones };
}
