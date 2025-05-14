<template>
  <div
    class="kpi-container flex flex-col items-center justify-center bg-neutral-100 rounded-4xl p-8 shadow-md"
  >
    <div class="kpi-number h2">{{ number }}</div>
    <div class="kpi-text body font-bold uppercase">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  number: string;
  text: string;
}>();
</script>

<style scoped></style>
