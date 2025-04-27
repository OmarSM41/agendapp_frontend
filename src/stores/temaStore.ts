import { defineStore } from 'pinia';
import axios from 'axios';

export const useTemaStore = defineStore('tema', {
  state: () => ({
    temas: [],
  }),
  actions: {
    async fetchTemas() {
      try {
        const response = await axios.get('https://localhost:7062/api/Tema');
        this.temas = response.data;
        return this.temas;
      } catch (error) {
        console.error('Error al obtener temas', error);
      }
    },
  },
});
