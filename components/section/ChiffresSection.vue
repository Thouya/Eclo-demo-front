<template>
  <section class="py-16 px-6 md:px-12 bg-gray-50">
    <div class="max-w-6xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-10">Nos chiffres clés</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div
          v-for="(stat, index) in statistiques"
          :key="index"
          class="bg-white p-6 rounded-lg shadow text-center"
        >
          <div class="text-4xl font-extrabold text-blue-600 mb-2">
            {{ stat.valeur }}
          </div>
          <div class="text-gray-700 text-lg">{{ stat.libelle }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Stat {
  valeur: string;
  libelle: string;
}

defineProps<{
  statistiques: Stat[];
}>();
</script>

<style scoped>
/* rien de plus à ajouter ici pour l'instant */
</style>
