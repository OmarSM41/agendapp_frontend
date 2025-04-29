import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token:      null as string | null,
    nombre:     null as string | null,
    correo:     null as string | null,
    rol:        null as string | null,
    id:         null as number | null,   // ID del usuario
    isAuthenticated: false,
  }),
  actions: {
    async login(correo: string, contraseña: string) {
      try {
        const response = await fetch('https://localhost:7062/api/Usuario/Auth/Login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contraseña }),
        })

        const data = await response.json()
        console.log('Respuesta del servidor:', data)

        if (!response.ok) {
          throw new Error(data.message || 'Error al iniciar sesión')
        }

        // Extraemos el objeto usuario
        const usuario = data.usuario

        this.token           = usuario.token
        this.nombre          = usuario.nombre
        this.correo          = usuario.correo
        this.rol             = usuario.rol
        this.id              = usuario.id
        this.isAuthenticated = true

        console.log('ID asignado:', this.id)

        // Guardar en localStorage
        localStorage.setItem('auth', JSON.stringify({
          token: this.token,
          nombre: this.nombre,
          correo: this.correo,
          rol:    this.rol,
          id:     this.id,
        }))

        // Verificación
        const stored = JSON.parse(localStorage.getItem('auth') || '{}')
        console.log('Datos guardados:', stored)

        return { success: true }
      } catch (err: any) {
        console.error('Error en login:', err)
        this.isAuthenticated = false
        return { success: false, message: err.message }
      }
    },

    loadFromStorage() {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const data = JSON.parse(stored)
        console.log('Datos cargados:', data)

        this.token           = data.token
        this.nombre          = data.nombre
        this.correo          = data.correo
        this.rol             = data.rol
        this.id              = data.id
        this.isAuthenticated = true

        console.log('ID cargado:', this.id)
      }
    },

    logout() {
      this.token = null
      this.nombre = null
      this.correo = null
      this.rol = null
      this.id = null
      this.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})
