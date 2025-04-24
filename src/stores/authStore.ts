import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    nombre: '',
    token: '',
  }),
  actions: {
    login(nombre: string, token: string) {
      this.isAuthenticated = true
      this.nombre = nombre
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('nombre', nombre)
    },
    logout() {
      this.isAuthenticated = false
      this.nombre = ''
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('nombre')
    },
    loadFromStorage() {
      const token = localStorage.getItem('token')
      const nombre = localStorage.getItem('nombre')
      if (token && nombre) {
        this.isAuthenticated = true
        this.nombre = nombre
        this.token = token
      }
    },
  },
})
