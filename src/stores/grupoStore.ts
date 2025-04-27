import { defineStore } from 'pinia';
import axios from 'axios';

export const useGrupoStore = defineStore('grupo', {
  state: () => ({
    grupos: [],
  }),
  actions: {
    async fetchGrupos() {
      try {
        const response = await axios.get('https://localhost:7062/api/Grupo');
        this.grupos = response.data;
        return this.grupos;
      } catch (error) {
        console.error('Error al obtener grupos', error);
      }
    },
  },
});
