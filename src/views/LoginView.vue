<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-200 to-gray-200"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
      <form @submit.prevent="loginUser">
        <div class="mb-4">
          <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="form.nombre"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ingresa tu nombre de usuario"
            required
          />
        </div>

        <div class="mb-4">
          <label for="contraseña" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            v-model="form.contraseña"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Iniciar Sesión
        </button>

        <p class="mt-4 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?
          <a href="/register" class="text-blue-500 hover:underline">Regístrate</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'
import { checkAuth } from '@/utils/auth'
import { useAuthStore } from '@/stores/authStore'

export default defineComponent({
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const form = reactive({
      nombre: '',
      contraseña: '',
    })

    const loginUser = async () => {
      try {
        const response = await api.post('/auth/login', form)
        console.log(response.data)
        alert('Inicio de sesión exitoso')
        auth.login(response.data.nombre, response.data.token)
        auth.loadFromStorage()
        checkAuth()
        router.push('/')
        console.log('Desde Header:', auth.nombre)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert('Error al iniciar sesión: ' + (error.response?.data?.mensaje || 'Inténtalo de nuevo'))
        console.error(error)
      }
    }

    return {
      form,
      loginUser,
    }

  },

})
</script>
