import { useState, useEffect } from 'react';
import { db } from '../db/database';

export function useHabits() {
  const [habitos, setHabitos] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const hoyStr = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const cargarHabitos = async () => {
    try {
      const listaHabitos = await db.habitos.toArray();
      const listaLogs = await db.habito_logs.where('fecha').equals(hoyStr).toArray();
      setHabitos(listaHabitos);
      setLogs(listaLogs);
    } catch (err) {
      console.error('Error al cargar hábitos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHabitos();
  }, []);

  const crearHabito = async (nombre) => {
    if (!nombre.trim()) return;
    await db.habitos.add({
      nombre,
      rachaActual: 0,
      mejorRacha: 0,
      createdAt: Date.now()
    });
    await cargarHabitos();
  };

  const toggleHabitoHoy = async (habito) => {
    const logExistente = logs.find(l => l.habitoId === habito.id);

    if (logExistente) {
      // Si ya estaba marcado, lo desmarcamos
      await db.habito_logs.delete(logExistente.id);
      const nuevaRacha = Math.max(0, habito.rachaActual - 1);
      await db.habitos.update(habito.id, { rachaActual: nuevaRacha });
    } else {
      // Marcar como completado hoy
      await db.habito_logs.add({
        habitoId: habito.id,
        fecha: hoyStr,
        completado: true
      });

      const nuevaRacha = habito.rachaActual + 1;
      const nuevaMejorRacha = Math.max(nuevaRacha, habito.mejorRacha);

      await db.habitos.update(habito.id, {
        rachaActual: nuevaRacha,
        mejorRacha: nuevaMejorRacha
      });
    }

    await cargarHabitos();
  };

  const eliminarHabito = async (id) => {
    await db.habitos.delete(id);
    await db.habito_logs.where('habitoId').equals(id).delete();
    await cargarHabitos();
  };

  return { habitos, logs, loading, hoyStr, crearHabito, toggleHabitoHoy, eliminarHabito };
}
