import { db } from '../db/database';

export async function detectarPatrones() {
  const patrones = [];

  try {
    const decisiones = await db.decisiones.toArray();
    const recuerdos = await db.recuerdos.toArray();
    const habitos = await db.habitos.toArray();

    // 1. Patrón: Frecuencia de toma de decisiones
    if (decisiones.length >= 3) {
      patrones.push({
        id: 'patron-decisiones-activas',
        patron: 'Toma de decisiones constante',
        frecuencia: `${decisiones.length} decisiones registradas`,
        confianza: 'Alta',
        descripcion: 'Utilizas frecuentemente la app para estructurar tus dilemas.'
      });
    }

    // 2. Patrón: Registro de salud / comida
    const recuerdosComida = recuerdos.filter(r => 
      r.contenido.toLowerCase().includes('comida') || 
      r.contenido.toLowerCase().includes('salud') || 
      r.contenido.toLowerCase().includes('daño')
    );

    if (recuerdosComida.length > 0) {
      patrones.push({
        id: 'patron-sensibilidad-alimenticia',
        patron: 'Preocupación por la alimentación',
        frecuencia: `${recuerdosComida.length} memoria(s) asociada(s)`,
        confianza: 'Media',
        descripcion: 'Tienes registro explícito sobre alimentos que te benefician o afectan.'
      });
    }

    // 3. Patrón: Hábitos en construcción
    const habitosConRacha = habitos.filter(h => h.rachaActual > 0);
    if (habitosConRacha.length > 0) {
      patrones.push({
        id: 'patron-habitos-activos',
        patron: 'Constancia en hábitos',
        frecuencia: `${habitosConRacha.length} hábito(s) en racha`,
        confianza: 'Alta',
        descripcion: 'Mantienes dinamismo activo en el cumplimiento diario.'
      });
    }

  } catch (err) {
    console.error('Error al detectar patrones:', err);
  }

  return patrones;
}
