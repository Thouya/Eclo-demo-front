<script setup lang="ts">
import RichTextRenderer from '~/components/fonction/RichTextRenderer.vue';
import { useStrapiImage } from '~/composables/useStrapiImage';

const props = defineProps<{
  titre: string;
  texte: any[];
  bouton_text?: string;
  bouton_lien?: string;
  image?: { url: string; alternativeText?: string };
}>();

const backgroundImageUrl = computed(() => useStrapiImage(props.image?.url));
</script>

<template>
  <section
    class="py-20 text-center text-white bg-cover bg-center"
    :style="{
      backgroundImage: backgroundImageUrl
        ? `url('${backgroundImageUrl}')`
        : undefined,
    }"
  >
    <div class="bg-black/50 px-6 py-10 rounded-lg inline-block">
      <h1 class="text-4xl font-bold mb-4">{{ titre }}</h1>
      <ClientOnly>
        <RichTextRenderer :document="texte" />
      </ClientOnly>
      <NuxtLink
        v-if="bouton_text && bouton_lien"
        :to="bouton_lien"
        class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {{ bouton_text }}
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
/* Le style est géré en Tailwind */
</style>
