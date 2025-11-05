export interface Ejercicio {
  id: string
  nombre: string
  descripcion: string
  series: number
  repeticiones: number
  descanso: number // en segundos
  categoria: 'fuerza' | 'cardio' | 'flexibilidad' | 'resistencias'
}

export interface Rutina {
  id: string
  nombre: string
  descripcion: string
  ejercicios: Ejercicio[]
  duracion: number // en minutos
  dificultad: 'principiante' | 'intermedio' | 'avanzado'
  fechaCreacion: string
}

export interface RutinaFormData {
  nombre: string
  descripcion: string
  dificultad: 'principiante' | 'intermedio' | 'avanzado'
}

