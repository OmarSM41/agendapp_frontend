import { defineStore } from 'pinia';
import axios from 'axios';

export const useHorarioStore = defineStore('horario', {
  state: () => ({
    horarios: [],
  }),
  actions: {
    async fetchHorarios() {
      try {
        const response = await axios.get('https://localhost:7062/api/Horario');
        this.horarios = response.data;
        return this.horarios;
      } catch (error) {
        console.error('Error al obtener horarios', error);
      }
    },
  },
});
