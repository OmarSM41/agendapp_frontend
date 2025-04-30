<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100">
    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-24 text-center animate-fade-in">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          <span class="bg-gradient-to-r from-amber-600 to-orange-500 text-transparent bg-clip-text">AppHorarios</span>
        </h1>
        <p class="text-lg md:text-2xl text-gray-700 mb-10">
          Organiza tareas, actividades y asistencia de tu equipo fácilmente y en tiempo real.
        </p>
        <a
          href="#about"
          class="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" />
          </svg>
          Conoce más
        </a>
      </div>

      <div class="mt-16 max-w-5xl mx-auto">
        <img
          src="https://cdn.pixabay.com/photo/2015/01/08/18/25/desk-593327_1280.jpg"
          alt="Control de asistencia"
          class="rounded-3xl shadow-2xl border-8 border-white hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-white rounded-t-3xl shadow-inner">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-4xl font-extrabold text-gray-900 mb-12">
            ¿Qué es <span class="text-amber-600">AppHorarios</span>?
          </h2>

          <div class="grid md:grid-cols-3 gap-8 text-left">
            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 class="text-xl font-semibold text-amber-700 mb-3">Organización sin esfuerzo</h3>
              <p class="text-gray-700">
                Crea y visualiza horarios personalizados de forma rápida y sencilla desde cualquier
                dispositivo.
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 class="text-xl font-semibold text-amber-700 mb-3">Gestión por grupos</h3>
              <p class="text-gray-700">
                Administra grupos académicos o administrativos, con filtros y vistas adaptadas a tus
                necesidades.
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 class="text-xl font-semibold text-amber-700 mb-3">Calendario inteligente</h3>
              <p class="text-gray-700">
                Usa un calendario visual interactivo para asignar actividades, tareas y registrar asistencia
                en tiempo real.
              </p>
            </div>
          </div>

          <div class="mt-14">
            <a
              href="#"
              class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-10 py-3 rounded-full shadow-lg transition-all text-lg"
            >
              Comenzar ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
