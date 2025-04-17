<template>
  <section class="py-16 px-6 md:px-12 bg-white">
    <div class="max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 text-center mb-10">
        Notre galerie
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="overflow-hidden rounded-lg shadow hover:shadow-lg transition"
        >
          <img
            :src="getImageUrl(img.url)"
            :alt="img.alternativeText || `Image ${index + 1}`"
            class="w-full h-64 object-cover"
          />
          <div
            v-if="legendes?.[index]?.texte"
            class="text-center text-gray-600 text-sm mt-2 px-2"
          >
            {{ legendes[index].texte }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ImageMedia {
  url: string;
  alternative_text?: string;
}

interface Legende {
  texte: string;
}

defineProps<{
  images: ImageMedia[];
  legendes?: Legende[];
}>();

const config = useRuntimeConfig();
const getImageUrl = (url: string) =>
  url.startsWith('http') ? url : `${config.public.STRAPI_URL}${url}`;
</script>

<style scoped>
/* aucune règle custom ici, Tailwind fait le job */
</style>
