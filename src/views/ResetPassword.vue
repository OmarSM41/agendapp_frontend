<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6">Restablecer Contraseña</h2>

      <form @submit.prevent="handleSubmit" v-if="!passwordReset">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Nueva contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nueva contraseña"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirmar contraseña"
          />
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl transition duration-200 flex justify-center items-center"
          :disabled="loading"
        >
          <span v-if="!loading">Restablecer contraseña</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>

      <div v-else class="text-center">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">¡Contraseña restablecida exitosamente!</h3>
        <p class="text-gray-600 mb-6">
          Ahora puedes iniciar sesión con tu nueva contraseña.
        </p>
        <router-link
          to="/login"
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-xl transition duration-200 block text-center"
        >
          Ir a iniciar sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const token = ref(route.query.token as string || '')
const email = ref(route.query.correo as string || '') // Obtener el correo desde la URL
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const passwordReset = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  if (!password.value || !confirmPassword.value) {
    error.value = 'Por favor completa todos los campos.'
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    loading.value = false
    return
  }

  try {
    const response = await fetch('https://localhost:7062/api/Usuario/Auth/Reset-Password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: email.value, // Usar el correo de la URL
        token: token.value,
        contraseña: password.value,
        confirmarContraseña: confirmPassword.value
      })
    })

    if (!response.ok) {
      const resData = await response.json()
      throw new Error(resData.message || 'Error al restablecer la contraseña')
    }

    passwordReset.value = true
  } catch (err: any) {
    console.error('Error:', err.message)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #f97316;
}
</style>
