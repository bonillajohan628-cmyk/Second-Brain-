import Dexie from 'dexie';

export const db = new Dexie('SecondBrainDB');

// Definición de tablas y sus índices
db.version(2).stores({
  decisiones: '++id, situation, createdAt',
  recuerdos: '++id, contenido, createdAt',
  habitos: '++id, nombre, rachaActual, mejorRacha, createdAt',
  habito_logs: '++id, habitoId, fecha, completado'
});
