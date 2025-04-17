<template>
  <section class="py-16 px-6 md:px-12">
    <div
      class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
      :class="{
        'md:flex-row-reverse': imagePosition === 'droite',
        'md:flex-row': imagePosition === 'gauche',
      }"
    >
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ titre }}</h2>
        <ClientOnly>
          <RichTextRenderer :document="texte" />
        </ClientOnly>
      </div>

      <div v-if="image?.url">
        <img
          :src="fullImageUrl"
          :alt="image?.alternativeText || titre"
          class="w-full h-auto rounded-xl shadow-md"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import RichTextRenderer from '~/components/fonction/RichTextRenderer.vue';

interface ImageData {
  url: string;
  alternativeText?: string;
}

defineProps<{
  titre: string;
  texte: any[];
  image?: ImageData;
  image_position: 'gauche' | 'droite';
}>();

const config = useRuntimeConfig();
const fullImageUrl = computed(() => useStrapiImage(image?.url));
</script>

<style scoped>
/* aucun style custom nécessaire ici */
</style>
