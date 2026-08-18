import { useState, useEffect } from 'react';
import { db } from '../db/database';

export function useDecisionHistory() {
  const [decisiones, setDecisiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarHistorial = async () => {
    try {
      const datos = await db.decisiones.orderBy('createdAt').reverse().toArray();
      setDecisiones(datos);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const eliminarDecision = async (id) => {
    await db.decisiones.delete(id);
    await cargarHistorial();
  };

  return { decisiones, loading, error, eliminarDecision, cargarHistorial };
}
