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

export interface Actividad {
  id: string
  tipo: 'rutina_creada' | 'rutina_editada' | 'rutina_eliminada' | 'ejercicio_agregado' | 'ejercicio_eliminado' | 'rutina_generada_ia'
  descripcion: string
  fecha: string
  rutinaId?: string
  rutinaNombre?: string
}

