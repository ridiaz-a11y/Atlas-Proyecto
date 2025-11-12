import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  nombre: string
  nombreUsuario: string // Nombre de usuario para mostrar
  sexo?: 'masculino' | 'femenino' | 'otro'
  fechaNacimiento?: string
  peso?: number // en kg
  talla?: number // en cm
  edad?: number
  fotoPerfil?: string // URL de la imagen
  objetivo?: string
  nivelActividad?: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso'
  fechaRegistro: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, nombre: string, nombreUsuario: string, sexo: 'masculino' | 'femenino' | 'otro') => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulación de login - en producción esto sería una llamada a una API
        // Por ahora, aceptamos cualquier email/password para desarrollo
        // Si el usuario ya existe en localStorage, lo recuperamos
        if (email && password) {
          // Intentar recuperar usuario existente del localStorage
          try {
            const stored = localStorage.getItem('atlas-auth-storage')
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed.state?.user?.email === email) {
                // Usuario encontrado, usar sus datos
                set({ user: parsed.state.user, isAuthenticated: true })
                return true
              }
            }
          } catch (e) {
            // Si hay error, crear nuevo usuario
          }
          
          // Si no existe, crear uno nuevo (solo para desarrollo)
          const user: User = {
            id: Date.now().toString(),
            email,
            nombre: email.split('@')[0],
            nombreUsuario: email.split('@')[0], // Usar parte del email como nombre de usuario temporal
            fechaRegistro: new Date().toISOString()
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (email: string, password: string, nombre: string, nombreUsuario: string, sexo: 'masculino' | 'femenino' | 'otro') => {
        // Simulación de registro
        if (email && password && nombre && nombreUsuario) {
          const user: User = {
            id: Date.now().toString(),
            email,
            nombre,
            nombreUsuario,
            sexo,
            fechaRegistro: new Date().toISOString()
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => {
          if (state.user) {
            return {
              user: { ...state.user, ...userData }
            }
          }
          return state
        })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'atlas-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)

