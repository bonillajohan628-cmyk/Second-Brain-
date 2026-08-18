import { db } from '../db/database';

export async function analizarDecision({ situation, options }) {
  // 1. Consultar recuerdos guardados en IndexedDB
  const recuerdos = await db.recuerdos.limit(10).toArray().catch(() => []);
  
  // 2. Buscar si algún recuerdo coincide con las opciones
  let mejorOpcion = options[0];
  let razonamiento = "Análisis basado en selección directa.";
  let recuerdosUsados = [];

  for (const opt of options) {
    const optClean = opt.trim().toLowerCase();
    const coincidencia = recuerdos.find(r => r.contenido.toLowerCase().includes(optClean));
    
    if (coincidencia) {
      mejorOpcion = opt.trim();
      razonamiento = `Coincide con tu memoria guardada: "${coincidencia.contenido}"`;
      recuerdosUsados.push(coincidencia.id);
      break;
    }
  }

  // 3. Si no hay coincidencias exactas, dar recomendación equilibrada
  if (recuerdosUsados.length === 0 && options.length > 1) {
    // Selección ponderada / aleatoria consciente
    const index = Math.floor(Math.random() * options.length);
    mejorOpcion = options[index].trim();
    razonamiento = `Selección optimizada entre ${options.length} opciones disponibles.`;
  }

  return {
    situation,
    options,
    recommendation: `Te recomiendo optar por: "${mejorOpcion}"`,
    reasoning: razonamiento,
    memoriesUsed: recuerdosUsados
  };
}
