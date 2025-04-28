<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const grupos = ref([]);
const nuevoGrupo = ref('');
const grupoEditando = ref(null);
const nombreEditado = ref('');

const cargarGrupos = async () => {
  try {
    const response = await axios.get('https://localhost:7062/api/Grupo');
    grupos.value = response.data;
  } catch (error) {
    console.error('Error al cargar grupos:', error);
    alert('Error al cargar grupos');
  }
};

const crearGrupo = async () => {
  try {
    await axios.post('https://localhost:7062/api/Grupo', { nombre: nuevoGrupo.value });
    nuevoGrupo.value = '';
    cargarGrupos();
    alert('Grupo creado correctamente');
  } catch (error) {
    console.error('Error al crear grupo:', error.response?.data);
    alert(error.response?.data?.message || 'Error al crear grupo');
  }
};

const eliminarGrupo = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar este grupo?')) return;
  try {
    await axios.delete(`https://localhost:7062/api/Grupo/${id}`);
    cargarGrupos();
    alert('Grupo eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar grupo:', error.response?.data);
    alert(error.response?.data?.message || 'Error al eliminar grupo');
  }
};

const editarGrupo = (grupo) => {
  grupoEditando.value = grupo.id;
  nombreEditado.value = grupo.nombre;
};

const actualizarGrupo = async (id: number) => {
  try {
    await axios.put(`https://localhost:7062/api/Grupo/${id}`, { nombre: nombreEditado.value });
    grupoEditando.value = null;
    nombreEditado.value = '';
    cargarGrupos();
    alert('Grupo actualizado correctamente');
  } catch (error) {
    console.error('Error al actualizar grupo:', error.response?.data);
    alert(error.response?.data?.message || 'Error al actualizar grupo');
  }
};

onMounted(() => {
  cargarGrupos();
});
</script>


<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Grupos</h1>

    <!-- Crear grupo -->
    <div class="flex mb-4 gap-2">
      <input v-model="nuevoGrupo" type="text" placeholder="Nuevo grupo" class="border rounded p-2" />
      <button @click="crearGrupo" class="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
    </div>

    <!-- Listado de grupos -->
    <table class="w-full table-auto border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">ID</th>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="grupo in grupos" :key="grupo.id">
          <td class="border p-2">{{ grupo.id }}</td>
          <td class="border p-2">
            <div v-if="grupoEditando === grupo.id">
              <input v-model="nombreEditado" class="border p-1" />
            </div>
            <div v-else>
              {{ grupo.nombre }}
            </div>
          </td>
          <td class="border p-2">
            <div v-if="grupoEditando === grupo.id">
              <button @click="actualizarGrupo(grupo.id)" class="bg-green-500 text-white px-2 py-1 rounded mr-2">Guardar</button>
              <button @click="grupoEditando = null" class="bg-gray-500 text-white px-2 py-1 rounded">Cancelar</button>
            </div>
            <div v-else>
              <button @click="editarGrupo(grupo)" class="bg-yellow-400 text-white px-2 py-1 rounded mr-2">Editar</button>
              <button @click="eliminarGrupo(grupo.id)" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

