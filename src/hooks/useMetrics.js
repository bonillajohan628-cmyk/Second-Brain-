import { useState, useEffect } from 'react';
import { db } from '../db/database';

export function useMetrics() {
  const [metrics, setMetrics] = useState({
    decisionesCount: 0,
    recuerdosCount: 0,
    habitosCount: 0,
    rachaMaxima: 0,
    loading: true
  });

  const cargarMetricas = async () => {
    try {
      const decCount = await db.decisiones.count();
      const recCount = await db.recuerdos.count();
      const habs = await db.habitos.toArray();
      
      const maxRacha = habs.length > 0 
        ? Math.max(...habs.map(h => h.rachaActual || 0)) 
        : 0;

      setMetrics({
        decisionesCount: decCount,
        recuerdosCount: recCount,
        habitosCount: habs.length,
        rachaMaxima: maxRacha,
        loading: false
      });
    } catch (err) {
      console.error('Error al cargar métricas:', err);
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  return { metrics, cargarMetricas };
}
