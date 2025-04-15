<template>
  <header class="bg-gradient-to-r from-blue-500 to-purple-400 shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo y nombre -->
      <div class="flex items-center space-x-3">
        <a href="/" class="text-xl font-bold text-white">AgendAPP</a>
      </div>

      <!-- Navegación principal -->
      <nav class="hidden md:flex space-x-6">
        <a href="/" class="text-white hover:text-purple-100 font-medium">Inicio</a>

        <a href="/dashboard" class="text-white hover:text-purple-100 font-medium">Dashboard</a>
        <a href="/usuarios" class="text-white hover:text-purple-100 font-medium">Registros</a>
      </nav>

      <!-- Botones adicionales -->
      <div class="flex items-center space-x-3">
        <template v-if="isAuthenticated">
          <!-- Mostrar si el usuario está autenticado -->
          <!-- <button
            class="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Nuevo registro
          </button> -->
          <div class="relative">
            <!-- <button
              class="flex items-center space-x-2 bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-2 rounded-md"
            >
              <span class="font-medium">{{ userName }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button> -->
          </div>
          <!-- <button
            @click="logout"
            class="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Cerrar sesión
          </button> -->
        </template>
        <template v-else>
          <!-- Mostrar si el usuario no está autenticado -->
          <!-- <a
            href="/login"
            class="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            class="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-md font-medium shadow-sm"
          >
            Registrarse
          </a> -->
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
