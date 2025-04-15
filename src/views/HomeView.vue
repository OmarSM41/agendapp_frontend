<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 md:py-24 text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">EntradAPP</h1>
        <p class="text-xl text-gray-600 mb-10">
          Control de asistencias: Simplifica el registro de entradas y salidas de tu equipo con
          nuestra solución tecnológica
        </p>
        <!-- <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link
            to="/login"
            class="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
          >
            Iniciar Sesión
          </router-link>
          <router-link
            to="/register"
            class="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
          >
            Registrarse
          </router-link>
        </div> -->
      </div>
      <div class="mt-16 max-w-4xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
          alt="Control de asistencia"
          class="rounded-xl shadow-xl border-8 border-white"
        />
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="bg-white py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">
          Descubre Nuestras Funciones
        </h2>

        <div class="grid md:grid-cols-3 gap-10">
          <!-- Tarjeta 1 -->
          <router-link
            to="/usuarios"
            class="group transform transition duration-500 hover:scale-105"
          >
            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl h-full"
            >
              <div class="flex justify-center mb-6">
                <div
                  class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-indigo-100 transition-colors"
                >
                  <svg
                    class="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">
                Registro Intuitivo
              </h3>
              <p class="text-gray-600 text-center text-lg leading-relaxed">
                Registra entradas y salidas con un solo clic y verificación facial instantánea.
              </p>
            </div>
          </router-link>

          <!-- Tarjeta 2 -->
          <router-link
            to="/dashboard"
            class="group transform transition duration-500 hover:scale-105"
          >
            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl h-full"
            >
              <div class="flex justify-center mb-6">
                <div
                  class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-indigo-100 transition-colors"
                >
                  <svg
                    class="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">
                Dashboard Completo
              </h3>
              <p class="text-gray-600 text-center text-lg leading-relaxed">
                Monitorea horarios en tiempo real y genera reportes automáticos con gráficos
                interactivos.
              </p>
            </div>
          </router-link>

          <!-- Tarjeta 3 -->
          <router-link
            :to="isAuthenticated ? '/perfil' : '/login'"
            class="group transform transition duration-500 hover:scale-105"
          >
            <div
              class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl h-full"
            >
              <div class="flex justify-center mb-6">
                <div
                  class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-indigo-100 transition-colors"
                >
                  <svg
                    class="w-10 h-10 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-semibold text-center mb-4 text-gray-800">
                {{ isAuthenticated ? 'Tu Perfil Personalizado' : 'Gestión de Perfil' }}
              </h3>
              <p class="text-gray-600 text-center text-lg leading-relaxed">
                {{
                  isAuthenticated
                    ? 'Administra tus datos, preferencias y accede a tu historial completo.'
                    : 'Únete a nuestra plataforma con un simple registro y disfruta de todos los beneficios.'
                }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <!-- <section class="bg-indigo-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Optimiza el control de asistencia en tu organización con nuestra solución tecnológica
        </p>
        <router-link
          to="/register"
          class="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition shadow-md"
        >
          Crear Cuenta Gratis
        </router-link>
      </div>
    </section> -->

    <!-- About Section -->
    <section id="about" class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Sobre EntradApp</h2>
          <div class="bg-white p-8 rounded-xl shadow-sm">
            <p class="text-gray-600 mb-6">
              EntradApp es una solución moderna para el control de asistencia de personal, diseñada
              para simplificar los procesos de registro de entradas y salidas en organizaciones de
              todos los tamaños.
            </p>
            <p class="text-gray-600 mb-6">
              Nuestra plataforma combina tecnología de reconocimiento facial opcional con una
              interfaz intuitiva, ofreciendo una experiencia sin fricciones tanto para
              administradores como para colaboradores.
            </p>
            <p class="text-gray-600">
              Con sede en México, nuestro equipo está comprometido con el desarrollo de herramientas
              que mejoren la productividad y transparencia en los procesos de recursos humanos.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const isAuthenticated = ref(false)

    onMounted(() => {
      // Verificar si hay un token almacenado
      isAuthenticated.value = !!localStorage.getItem('authToken')
    })

    return {
      isAuthenticated,
    }
  },
})
</script>
