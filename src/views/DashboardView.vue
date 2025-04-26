
<template>
  <div class="dashboard-view">
    <h1>Dashboard</h1>
    <div class="stats">
      <div class="stat-card" v-for="stat in stats" :key="stat.id">
        <h2>{{ stat.title }}</h2>
        <p>{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DashboardView",
  data() {
    return {
      stats: [
        { id: 1, title: "Users", value: 120 },
        { id: 2, title: "Sales", value: "$5,000" },
        { id: 3, title: "Orders", value: 45 },
      ],
    };
  },
};
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}

.stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
