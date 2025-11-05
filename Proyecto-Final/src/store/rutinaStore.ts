import { create } from 'zustand'
import { Rutina, Ejercicio } from '../types'

interface RutinaStore {
  rutinas: Rutina[]
  addRutina: (rutina: Omit<Rutina, 'id' | 'fechaCreacion'>) => void
  deleteRutina: (id: string) => void
  updateRutina: (id: string, rutina: Partial<Rutina>) => void
  addEjercicioToRutina: (rutinaId: string, ejercicio: Omit<Ejercicio, 'id'>) => void
  deleteEjercicioFromRutina: (rutinaId: string, ejercicioId: string) => void
}

export const useRutinaStore = create<RutinaStore>((set) => ({
  rutinas: [
    {
      id: '1',
      nombre: 'Rutina Full Body',
      descripcion: 'Rutina completa para todo el cuerpo',
      dificultad: 'intermedio',
      fechaCreacion: new Date().toISOString(),
      duracion: 45,
      ejercicios: [
        {
          id: '1-1',
          nombre: 'Sentadillas',
          descripcion: 'Ejercicio para piernas',
          series: 3,
          repeticiones: 12,
          descanso: 60,
          categoria: 'fuerza'
        },
        {
          id: '1-2',
          nombre: 'Flexiones',
          descripcion: 'Ejercicio para pecho y brazos',
          series: 3,
          repeticiones: 10,
          descanso: 45,
          categoria: 'fuerza'
        }
      ]
    }
  ],

  addRutina: (rutina) => {
    const nuevaRutina: Rutina = {
      ...rutina,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      ejercicios: []
    }
    set((state) => ({
      rutinas: [...state.rutinas, nuevaRutina]
    }))
  },

  deleteRutina: (id) => {
    set((state) => ({
      rutinas: state.rutinas.filter((r) => r.id !== id)
    }))
  },

  updateRutina: (id, updatedData) => {
    set((state) => ({
      rutinas: state.rutinas.map((r) =>
        r.id === id ? { ...r, ...updatedData } : r
      )
    }))
  },

  addEjercicioToRutina: (rutinaId, ejercicio) => {
    const nuevoEjercicio: Ejercicio = {
      ...ejercicio,
      id: `${rutinaId}-${Date.now()}`
    }
    set((state) => ({
      rutinas: state.rutinas.map((r) =>
        r.id === rutinaId
          ? { ...r, ejercicios: [...r.ejercicios, nuevoEjercicio] }
          : r
      )
    }))
  },

  deleteEjercicioFromRutina: (rutinaId, ejercicioId) => {
    set((state) => ({
      rutinas: state.rutinas.map((r) =>
        r.id === rutinaId
          ? { ...r, ejercicios: r.ejercicios.filter((e) => e.id !== ejercicioId) }
          : r
      )
    }))
  }
}))

