<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-3xl font-bold text-center mb-6">Crear cuenta</h2>

      <form @submit.prevent="registrarUsuario" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-1">Nombre</label>
          <input v-model="nombre" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-1">Apellido</label>
          <input v-model="apellido" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-1">Correo</label>
          <input v-model="correo" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-1">Contraseña</label>
          <input v-model="contraseña" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-1">Confirmar contraseña</label>
          <input v-model="confirmacionContraseña" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

        <button type="submit" class="w-full bg-orange-600 hover:bg-orange-800 text-white font-semibold py-2 rounded-xl transition duration-200">
          Registrarse
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombre = ref('')
const apellido = ref('')
const correo = ref('')
const contraseña = ref('')
const confirmacionContraseña = ref('')
const error = ref('')

const registrarUsuario = async () => {
  if (contraseña.value !== confirmacionContraseña.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    const response = await fetch('https://localhost:7062/api/Usuario/Auth/Register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value,
        apellido: apellido.value,
        correo: correo.value,
        contraseña: contraseña.value,
        confirmacionContraseña: confirmacionContraseña.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error en el registro:', errorData)
      throw new Error(errorData.message || 'Error al registrar')
    }

    const data = await response.json()
    console.log('Usuario registrado exitosamente:', data)
    alert('Registro exitoso ✅')
    router.push('/login')
  } catch (err) {
    console.error('Error:', err.message)
    error.value = err.message
  }
}
</script>

