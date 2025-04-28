import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    nombre: null as string | null,
    correo: null as string | null,
    rol: null as string | null,
    isAuthenticated: false,
  }),
  actions: {
    async login(correo: string, contraseña: string) {
      try {
        const response = await fetch('https://localhost:7062/api/Usuario/Auth/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

        // Corrigiendo: no es data.usuario.token
        this.token = data.token;
        this.nombre = data.nombre;
        this.correo = data.correo;
        this.rol = data.rol;
        this.isAuthenticated = true;

        localStorage.setItem(
          'auth',
          JSON.stringify({
            token: this.token,
            nombre: this.nombre,
            correo: this.correo,
            rol: this.rol,
          })
        );

        return { success: true };
      } catch (err: any) {
        this.isAuthenticated = false; // extra cuidado
        return { success: false, message: err.message };
      }
    },
    loadFromStorage() {
      const stored = localStorage.getItem('auth');
      if (stored) {
        const data = JSON.parse(stored);
        this.token = data.token;
        this.nombre = data.nombre;
        this.correo = data.correo;
        this.rol = data.rol;
        this.isAuthenticated = true;
      }
    },
    logout() {
      this.token = null;
      this.nombre = null;
      this.correo = null;
      this.rol = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});
