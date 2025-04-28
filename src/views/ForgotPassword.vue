<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6">Recuperar contraseña</h2>

      <!-- Formulario para solicitar recuperación -->
      <form @submit.prevent="handleSubmit" v-if="!emailSent">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-1">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ejemplo@ejemplo.com"
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
          <span v-if="!loading">Enviar enlace</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>

        <div class="text-center mt-4">
          <router-link
            to="/login"
            class="text-sm text-orange-600 hover:text-orange-800 hover:underline"
          >
            ← Volver al inicio de sesión
          </router-link>
        </div>
      </form>

      <!-- Mensaje de éxito -->
      <div v-else class="text-center">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">¡Correo enviado con éxito!</h3>
        <p class="text-gray-600 mb-6">
          Hemos enviado un enlace de recuperación a <span class="font-semibold">{{ email }}</span>.
          Revisa tu bandeja de entrada y la carpeta de spam.
        </p>
        <button
          @click="resetForm"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-xl transition duration-200"
        >
          Enviar a otro correo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const email = ref('')
const error = ref('')
const loading = ref(false)
const emailSent = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await fetch('https://localhost:7062/api/Usuario/Auth/Forgot-Password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        correo: email.value,
        token: '',
        contraseña: '',
        confirmarContraseña: ''

      })
    })

    console.log('Respuesta del servidor:', response.data)
    emailSent.value = true

  } catch (err) {
    console.error('Error:', err.message)
    error.value = err.message  }
}

const resetForm = () => {
  emailSent.value = false
  email.value = ''
  error.value = ''
}
</script>

<style scoped>
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #f97316; /* Mantener color naranja cuando está deshabilitado */
}
</style>
