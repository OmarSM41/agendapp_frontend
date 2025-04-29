import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    nombre: null as string | null,
    correo: null as string | null,
    rol: null as string | null,
    id: null as number | null, // Cambiado a minúscula para consistencia
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
        console.log("Respuesta del servidor:", data); // Depuración

        if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

        // Asignación correcta desde la respuesta API
        this.token = data.token;
        this.nombre = data.nombre;
        this.correo = data.correo;
        this.rol = data.rol;
        this.id = data.id; // ← Usamos minúscula para coincidir con API
        this.isAuthenticated = true;

        console.log("ID asignado:", this.id); // Verificación

        // Guardamos en localStorage con las mismas propiedades
        localStorage.setItem(
          'auth',
          JSON.stringify({
            token: this.token,
            nombre: this.nombre,
            correo: this.correo,
            rol: this.rol,
            id: this.id, // ← Mismo nombre que en el state
          })
        );

        // Verificación de lo guardado
        const stored = localStorage.getItem('auth');
        console.log("Datos guardados:", JSON.parse(stored || '{}'));

        return { success: true };
      } catch (err: any) {
        console.error("Error en login:", err);
        this.isAuthenticated = false;
        return { success: false, message: err.message };
      }
    },
    loadFromStorage() {
      const stored = localStorage.getItem('auth');
      if (stored) {
        const data = JSON.parse(stored);
        console.log("Datos cargados:", data); // Depuración

        // Asignación consistente
        this.token = data.token;
        this.nombre = data.nombre;
        this.correo = data.correo;
        this.rol = data.rol;
        this.id = data.id; // ← Mismo nombre que al guardar
        this.isAuthenticated = true;

        console.log("ID cargado:", this.id); // Verificación
      }
    },
    logout() {
      this.token = null;
      this.nombre = null;
      this.correo = null;
      this.rol = null;
      this.id = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});
