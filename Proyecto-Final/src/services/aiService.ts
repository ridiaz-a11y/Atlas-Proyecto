import { Rutina, Ejercicio } from '../types'

interface GenerarRutinaParams {
  objetivo: string
  dificultad: 'principiante' | 'intermedio' | 'avanzado'
  duracion: number // en minutos
  diasSemana: number
}

// Base de datos de ejercicios por categoría
const ejerciciosPorCategoria = {
  fuerza: {
    principiante: [
      { nombre: 'Sentadillas', descripcion: 'Ejercicio fundamental para piernas y glúteos', series: 3, repeticiones: 12, descanso: 60 },
      { nombre: 'Flexiones', descripcion: 'Fortalece pecho, hombros y tríceps', series: 3, repeticiones: 10, descanso: 45 },
      { nombre: 'Plancha', descripcion: 'Fortalece el core y estabilización', series: 3, repeticiones: 30, descanso: 45 },
      { nombre: 'Zancadas', descripcion: 'Ejercicio unilateral para piernas', series: 3, repeticiones: 10, descanso: 45 },
      { nombre: 'Fondos en silla', descripcion: 'Fortalece tríceps y hombros', series: 3, repeticiones: 10, descanso: 45 }
    ],
    intermedio: [
      { nombre: 'Sentadillas con salto', descripcion: 'Sentadillas explosivas para potencia', series: 4, repeticiones: 12, descanso: 60 },
      { nombre: 'Flexiones diamante', descripcion: 'Variación avanzada de flexiones', series: 4, repeticiones: 12, descanso: 60 },
      { nombre: 'Plancha lateral', descripcion: 'Fortalece oblicuos y core', series: 3, repeticiones: 45, descanso: 45 },
      { nombre: 'Burpees', descripcion: 'Ejercicio completo de cuerpo', series: 3, repeticiones: 10, descanso: 60 },
      { nombre: 'Mountain climbers', descripcion: 'Cardio y fuerza combinados', series: 3, repeticiones: 20, descanso: 45 }
    ],
    avanzado: [
      { nombre: 'Sentadillas pistol', descripcion: 'Sentadillas a una pierna', series: 3, repeticiones: 8, descanso: 90 },
      { nombre: 'Flexiones con palmada', descripcion: 'Flexiones explosivas', series: 4, repeticiones: 8, descanso: 90 },
      { nombre: 'Plancha con elevación de pierna', descripcion: 'Plancha avanzada', series: 3, repeticiones: 12, descanso: 60 },
      { nombre: 'Burpees con salto', descripcion: 'Burpees avanzados', series: 4, repeticiones: 12, descanso: 90 },
      { nombre: 'Handstand push-ups', descripcion: 'Flexiones en parada de manos', series: 3, repeticiones: 5, descanso: 120 }
    ]
  },
  cardio: {
    principiante: [
      { nombre: 'Caminata rápida', descripcion: 'Cardio de bajo impacto', series: 1, repeticiones: 20, descanso: 0 },
      { nombre: 'Jumping jacks', descripcion: 'Salto de tijera', series: 3, repeticiones: 15, descanso: 30 },
      { nombre: 'Correr en el lugar', descripcion: 'Cardio básico', series: 3, repeticiones: 30, descanso: 30 },
      { nombre: 'Step-ups', descripcion: 'Subir y bajar escalón', series: 3, repeticiones: 12, descanso: 30 }
    ],
    intermedio: [
      { nombre: 'HIIT - Sprint', descripcion: 'Carreras de alta intensidad', series: 5, repeticiones: 30, descanso: 30 },
      { nombre: 'Jumping jacks avanzados', descripcion: 'Salto de tijera con variaciones', series: 4, repeticiones: 20, descanso: 20 },
      { nombre: 'Burpees', descripcion: 'Ejercicio completo de cardio', series: 4, repeticiones: 12, descanso: 45 },
      { nombre: 'Mountain climbers', descripcion: 'Escalador de montaña', series: 4, repeticiones: 30, descanso: 30 }
    ],
    avanzado: [
      { nombre: 'HIIT avanzado', descripcion: 'Intervalos de alta intensidad', series: 6, repeticiones: 45, descanso: 15 },
      { nombre: 'Burpees con salto', descripcion: 'Burpees explosivos', series: 5, repeticiones: 15, descanso: 30 },
      { nombre: 'Sprint intervals', descripcion: 'Carreras de velocidad', series: 6, repeticiones: 20, descanso: 20 },
      { nombre: 'Complejos de ejercicios', descripcion: 'Secuencias complejas', series: 4, repeticiones: 10, descanso: 60 }
    ]
  },
  flexibilidad: {
    principiante: [
      { nombre: 'Estiramiento de cuádriceps', descripcion: 'Estiramiento de piernas', series: 2, repeticiones: 30, descanso: 0 },
      { nombre: 'Estiramiento de isquiotibiales', descripcion: 'Flexibilidad de piernas', series: 2, repeticiones: 30, descanso: 0 },
      { nombre: 'Estiramiento de hombros', descripcion: 'Movilidad de hombros', series: 2, repeticiones: 20, descanso: 0 },
      { nombre: 'Giro de cadera', descripcion: 'Movilidad de cadera', series: 2, repeticiones: 15, descanso: 0 }
    ],
    intermedio: [
      { nombre: 'Yoga flow básico', descripcion: 'Secuencia de yoga', series: 1, repeticiones: 1, descanso: 0 },
      { nombre: 'Estiramientos dinámicos', descripcion: 'Movilidad activa', series: 3, repeticiones: 12, descanso: 15 },
      { nombre: 'Pilates básico', descripcion: 'Fortalecimiento y flexibilidad', series: 3, repeticiones: 10, descanso: 30 }
    ],
    avanzado: [
      { nombre: 'Yoga avanzado', descripcion: 'Posturas avanzadas de yoga', series: 1, repeticiones: 1, descanso: 0 },
      { nombre: 'Estiramientos profundos', descripcion: 'Flexibilidad avanzada', series: 3, repeticiones: 45, descanso: 30 },
      { nombre: 'Movilidad completa', descripcion: 'Rango completo de movimiento', series: 4, repeticiones: 15, descanso: 20 }
    ]
  }
}

export async function generarRutinaConIA(params: GenerarRutinaParams): Promise<Omit<Rutina, 'id' | 'fechaCreacion'>> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1500))

  const { objetivo, dificultad, duracion, diasSemana } = params
  
  // Determinar categorías basadas en el objetivo
  let categorias: ('fuerza' | 'cardio' | 'flexibilidad' | 'resistencias')[] = []
  
  if (objetivo.toLowerCase().includes('fuerza') || objetivo.toLowerCase().includes('musculo')) {
    categorias.push('fuerza')
  }
  if (objetivo.toLowerCase().includes('cardio') || objetivo.toLowerCase().includes('perder') || objetivo.toLowerCase().includes('quemar')) {
    categorias.push('cardio')
  }
  if (objetivo.toLowerCase().includes('flexibilidad') || objetivo.toLowerCase().includes('estiramiento')) {
    categorias.push('flexibilidad')
  }
  
  // Si no se especifica, usar fuerza y cardio por defecto
  if (categorias.length === 0) {
    categorias = ['fuerza', 'cardio']
  }

  // Calcular número de ejercicios basado en duración
  const tiempoPorEjercicio = 5 // minutos promedio por ejercicio
  const numEjercicios = Math.max(4, Math.min(10, Math.floor(duracion / tiempoPorEjercicio)))

  // Seleccionar ejercicios
  const ejercicios: Ejercicio[] = []
  const ejerciciosSeleccionados = new Set<string>()

  categorias.forEach(categoria => {
    const ejerciciosDisponibles = ejerciciosPorCategoria[categoria]?.[dificultad] || []
    const ejerciciosCategoria = ejerciciosDisponibles
      .filter(ej => !ejerciciosSeleccionados.has(ej.nombre))
      .slice(0, Math.ceil(numEjercicios / categorias.length))
    
    ejerciciosCategoria.forEach(ej => {
      ejerciciosSeleccionados.add(ej.nombre)
      ejercicios.push({
        id: `temp-${Date.now()}-${ejercicios.length}`,
        nombre: ej.nombre,
        descripcion: ej.descripcion,
        series: ej.series,
        repeticiones: ej.repeticiones,
        descanso: ej.descanso,
        categoria: categoria as 'fuerza' | 'cardio' | 'flexibilidad' | 'resistencias'
      })
    })
  })

  // Asegurar que tenemos al menos algunos ejercicios
  while (ejercicios.length < 4) {
    const categoria = categorias[ejercicios.length % categorias.length]
    const ejerciciosDisponibles = ejerciciosPorCategoria[categoria]?.[dificultad] || []
    if (ejerciciosDisponibles.length > 0) {
      const ej = ejerciciosDisponibles[0]
      if (!ejerciciosSeleccionados.has(ej.nombre)) {
        ejerciciosSeleccionados.add(ej.nombre)
        ejercicios.push({
          id: `temp-${Date.now()}-${ejercicios.length}`,
          nombre: ej.nombre,
          descripcion: ej.descripcion,
          series: ej.series,
          repeticiones: ej.repeticiones,
          descanso: ej.descanso,
          categoria: categoria as 'fuerza' | 'cardio' | 'flexibilidad' | 'resistencias'
        })
      }
    }
  }

  // Generar nombre y descripción
  const nombresRutina = [
    `Rutina ${dificultad.charAt(0).toUpperCase() + dificultad.slice(1)} - ${objetivo}`,
    `Entrenamiento Personalizado - ${dificultad}`,
    `Rutina ${objetivo} - Nivel ${dificultad}`,
    `Plan de Entrenamiento ${dificultad}`
  ]

  const descripcionesRutina = [
    `Rutina generada con IA enfocada en ${objetivo}. Nivel ${dificultad} con ${ejercicios.length} ejercicios.`,
    `Entrenamiento personalizado de ${duracion} minutos diseñado para ${objetivo}. Perfecto para nivel ${dificultad}.`,
    `Rutina completa generada inteligentemente para ayudarte a alcanzar tu objetivo: ${objetivo}.`
  ]

  return {
    nombre: nombresRutina[Math.floor(Math.random() * nombresRutina.length)],
    descripcion: descripcionesRutina[Math.floor(Math.random() * descripcionesRutina.length)],
    dificultad,
    duracion,
    ejercicios: ejercicios.slice(0, numEjercicios)
  }
}

