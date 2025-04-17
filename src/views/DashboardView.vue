<template>
  <div class="p-6 bg-gray-100">
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Tabla de contenido</h1>
    <table class="table-auto border-collapse border border-gray-300 w-full text-left">
      <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 px-4 py-2">Hora</th>
          <th class="border border-gray-300 px-4 py-2">Lunes</th>
          <th class="border border-gray-300 px-4 py-2">Martes</th>
          <th class="border border-gray-300 px-4 py-2">Miercoles</th>
          <th class="border border-gray-300 px-4 py-2">Jueves</th>
          <th class="border border-gray-300 px-4 py-2">Viernes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in 10" :key="row" class="odd:bg-white even:bg-gray-50">
          <td v-for="col in 6" :key="col" class="border border-gray-300 px-4 py-2">
            Algo
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
