<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6">Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Correo electrónico</label>
          <input
            v-model="correo"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ejemplo@ejemplo.com"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Contraseña</label>
          <input
            v-model="contraseña"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••••"
          />
        </div>
        <div class="text-red-500 text-sm mb-2" v-if="auth.error">{{ auth.error }}</div>
        <button
          type="submit"
          class="w-full bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 rounded-xl transition duration-200"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const correo = ref('')
const contraseña = ref('')
const error = ref(null)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const result = await auth.login(correo.value, contraseña.value)
  if (result.success) {
    console.log('Inicio de sesión exitoso:')
    alert('Inicio de sesión exitoso')
    router.push('/') // o donde desees redirigir
  } else {
    console.error('Error al iniciar sesión:', result.message)
    error.value = result.message
  }
}
</script>

