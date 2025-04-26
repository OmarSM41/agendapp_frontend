import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    nombre: null,
    correo: null,
    rol: null,
    isAuthenticated: false, // ✅ nuevo
  }),
  actions: {
    async login(correo, contraseña) {
      try {
        const response = await fetch('https://localhost:7062/api/Usuario/Auth/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        })

        const data = await response.json()

        if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión')

        this.token = data.usuario.token
        this.nombre = data.usuario.nombre
        this.correo = data.usuario.correo
        this.rol = data.usuario.rol
        this.isAuthenticated = true

        localStorage.setItem(
          'auth',
          JSON.stringify({
            token: this.token,
            nombre: this.nombre,
            correo: this.correo,
            rol: this.rol,
          })
        )

        return { success: true }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    loadFromStorage() {
      const stored = localStorage.getItem('auth')
      if (stored) {
        const data = JSON.parse(stored)
        this.token = data.token
        this.nombre = data.nombre
        this.correo = data.correo
        this.rol = data.rol
        this.isAuthenticated = true
      }
    },
    logout() {
      this.token = null
      this.nombre = null
      this.correo = null
      this.rol = null
      this.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})
