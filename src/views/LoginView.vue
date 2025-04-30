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
          <div class="text-right mt-1">
            <router-link
              to="/Forgot-Password"
              class="text-sm text-orange-600 hover:text-orange-800 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
        </div>

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
import { useToast } from 'vue-toastification'

const correo = ref('')
const contraseña = ref('')
const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const handleLogin = async () => {
  const result = await auth.login(correo.value, contraseña.value)
  if (result.success) {
    toast.success('Inicio de sesión exitoso')
    router.push('/')
  } else {
    toast.error(result.message || 'Error al iniciar sesión')
  }
}
</script>
