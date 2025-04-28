<template>
  <header class="bg-gradient-to-r from-orange-500 to-amber-400 shadow-xl">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo y nombre -->
      <div class="flex items-center space-x-3">
        <a href="/" class="text-xl font-bold text-white">HorarioAPP</a>
      </div>

      <!-- Navegación principal -->
      <nav class="hidden md:flex space-x-6">
        <a href="/" class="text-white hover:text-purple-100 font-medium">Inicio</a>
        <a href="/agenda" class="text-white hover:text-purple-100 font-medium">Agenda</a>
      </nav>

      <!-- Botones adicionales -->
      <div class="flex items-center space-x-3">
        <template v-if="auth.isAuthenticated">
          <div class="relative flex items-center space-x-3">
            <span class="text-white font-medium">Hola, {{ auth.nombre }}</span>
            <button
              @click="cerrarSesion"
              class="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md font-medium shadow-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </template>
        <template v-else>
          <a
            href="/login"
            class="bg-white text-black-600 hover:bg-amber-100 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            class="bg-white text-black-700 hover:bg-amber-100 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Registrarse
          </a>
        </template>
      </div>

      <!-- Menú móvil -->
      <div class="md:hidden">
        <button class="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'


export default {
  setup() {
    const auth = useAuthStore()
    const router = useRouter()

    onMounted(() => {
      auth.loadFromStorage()
    })

    const cerrarSesion = () => {
      auth.logout()
      router.push('/login')
    }

    return {
      auth,
      cerrarSesion,
    }



  },
}
</script>
