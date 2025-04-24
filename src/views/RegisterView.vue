<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-200 to-gray-200"
  >
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Registrar</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="name"
            v-model="form.nombre"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Correo Electrónico</label
          >
          <input
            type="email"
            id="email"
            v-model="form.correo"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ingresa tu correo"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="form.contraseña"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <div class="mb-4">
          <label for="rol" class="block text-sm font-medium text-gray-700">Rol</label>
          <select
            id="rol"
            v-model="form.rol"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="Usuario">Usuario</option>
            <option value="Profesor">Profesor</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Registrar
        </button>

        <p class="mt-4 text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?
          <a href="/login" class="text-blue-500 hover:underline">Inicia Sesión</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    const form = reactive({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: 'Usuario',
    })

    const registerUser = async () => {
      try {
        const response = await api.post('/auth/register', form)
        alert('Registro exitoso')
        router.push('/login');
        console.log(response.data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert('Error al registrar: ' + (error.response?.data?.mensaje || 'Inténtalo de nuevo'))
        console.error(error)
      }
    }

    return {
      form,
      registerUser,
    }
  },
})
</script>
