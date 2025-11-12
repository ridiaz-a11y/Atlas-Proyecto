import { create } from 'zustand'
import { Rutina, Ejercicio, Actividad } from '../types'

interface RutinaStore {
  rutinas: Rutina[]
  actividades: Actividad[]
  addRutina: (rutina: Omit<Rutina, 'id' | 'fechaCreacion'>, generadaConIA?: boolean) => void
  deleteRutina: (id: string) => void
  updateRutina: (id: string, rutina: Partial<Rutina>) => void
  addEjercicioToRutina: (rutinaId: string, ejercicio: Omit<Ejercicio, 'id'>) => void
  deleteEjercicioFromRutina: (rutinaId: string, ejercicioId: string) => void
  addActividad: (actividad: Omit<Actividad, 'id' | 'fecha'>) => void
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
  actividades: [
    {
      id: '1',
      tipo: 'rutina_creada',
      descripcion: 'Rutina "Rutina Full Body" creada',
      fecha: new Date().toISOString(),
      rutinaId: '1',
      rutinaNombre: 'Rutina Full Body'
    }
  ],

  addRutina: (rutina, generadaConIA = false) => {
    const nuevaRutina: Rutina = {
      ...rutina,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      ejercicios: rutina.ejercicios || []
    }
    set((state) => ({
      rutinas: [...state.rutinas, nuevaRutina],
      actividades: [...state.actividades, {
        id: Date.now().toString(),
        tipo: generadaConIA ? 'rutina_generada_ia' : 'rutina_creada',
        descripcion: generadaConIA 
          ? `Rutina "${nuevaRutina.nombre}" generada con IA`
          : `Rutina "${nuevaRutina.nombre}" creada`,
        fecha: new Date().toISOString(),
        rutinaId: nuevaRutina.id,
        rutinaNombre: nuevaRutina.nombre
      }]
    }))
  },

  deleteRutina: (id) => {
    set((state) => {
      const rutina = state.rutinas.find((r) => r.id === id)
      return {
        rutinas: state.rutinas.filter((r) => r.id !== id),
        actividades: [...state.actividades, {
          id: Date.now().toString(),
          tipo: 'rutina_eliminada',
          descripcion: `Rutina "${rutina?.nombre || 'Sin nombre'}" eliminada`,
          fecha: new Date().toISOString(),
          rutinaId: id,
          rutinaNombre: rutina?.nombre
        }]
      }
    })
  },

  updateRutina: (id, updatedData) => {
    set((state) => {
      const rutina = state.rutinas.find((r) => r.id === id)
      return {
        rutinas: state.rutinas.map((r) =>
          r.id === id ? { ...r, ...updatedData } : r
        ),
        actividades: [...state.actividades, {
          id: Date.now().toString(),
          tipo: 'rutina_editada',
          descripcion: `Rutina "${updatedData.nombre || rutina?.nombre || 'Sin nombre'}" editada`,
          fecha: new Date().toISOString(),
          rutinaId: id,
          rutinaNombre: updatedData.nombre || rutina?.nombre
        }]
      }
    })
  },

  addEjercicioToRutina: (rutinaId, ejercicio) => {
    const nuevoEjercicio: Ejercicio = {
      ...ejercicio,
      id: `${rutinaId}-${Date.now()}`
    }
    set((state) => {
      const rutina = state.rutinas.find((r) => r.id === rutinaId)
      return {
        rutinas: state.rutinas.map((r) =>
          r.id === rutinaId
            ? { ...r, ejercicios: [...r.ejercicios, nuevoEjercicio] }
            : r
        ),
        actividades: [...state.actividades, {
          id: Date.now().toString(),
          tipo: 'ejercicio_agregado',
          descripcion: `Ejercicio "${ejercicio.nombre}" agregado a "${rutina?.nombre || 'rutina'}"`,
          fecha: new Date().toISOString(),
          rutinaId,
          rutinaNombre: rutina?.nombre
        }]
      }
    })
  },

  deleteEjercicioFromRutina: (rutinaId, ejercicioId) => {
    set((state) => {
      const rutina = state.rutinas.find((r) => r.id === rutinaId)
      const ejercicio = rutina?.ejercicios.find((e) => e.id === ejercicioId)
      return {
        rutinas: state.rutinas.map((r) =>
          r.id === rutinaId
            ? { ...r, ejercicios: r.ejercicios.filter((e) => e.id !== ejercicioId) }
            : r
        ),
        actividades: [...state.actividades, {
          id: Date.now().toString(),
          tipo: 'ejercicio_eliminado',
          descripcion: `Ejercicio "${ejercicio?.nombre || 'Sin nombre'}" eliminado de "${rutina?.nombre || 'rutina'}"`,
          fecha: new Date().toISOString(),
          rutinaId,
          rutinaNombre: rutina?.nombre
        }]
      }
    })
  },

  addActividad: (actividad) => {
    set((state) => ({
      actividades: [...state.actividades, {
        ...actividad,
        id: Date.now().toString(),
        fecha: new Date().toISOString()
      }]
    }))
  }
}))

