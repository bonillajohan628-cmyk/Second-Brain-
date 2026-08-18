import { useState, useEffect } from 'react';
import { db } from '../db/database';

export function useMemories() {
  const [recuerdos, setRecuerdos] = useState([]);

  const cargarRecuerdos = async () => {
    try {
      const datos = await db.recuerdos.orderBy('createdAt').reverse().toArray();
      setRecuerdos(datos);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarRecuerdos();
  }, []);

  const guardarRecuerdo = async (contenido, etiquetas = []) => {
    if (!contenido.trim()) return;
    await db.recuerdos.add({
      contenido,
      etiquetas,
      createdAt: Date.now()
    });
    await cargarRecuerdos();
  };

  const eliminarRecuerdo = async (id) => {
    await db.recuerdos.delete(id);
    await cargarRecuerdos();
  };

  return { recuerdos, guardarRecuerdo, eliminarRecuerdo };
}
