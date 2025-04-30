<template>
  <ClientOnly>
    <heroSection
      v-if="heroSection"
      :title="heroSection.titre"
      :textDocument="heroSection.texte"
      :buttonText="heroSection.bouton_text"
      :buttonLink="heroSection.bouton_lien"
      :backgroundImageUrl="heroImageUrl"
    />

    <sideImageSection
      v-if="sideImageSection"
      :title="sideImageSection.Titre"
      :textDocument="sideImageSection.texte"
      :ImageUrl="sideImageUrl"
      :ImagePosition="sideImageSection.image_position"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import HeroSection from '~/components/section/HeroSection.vue';
import SideImageSection from '~/components/section/SideImageSection.vue';

const config = useRuntimeConfig();

interface PageTest {
  data: Array<{
    sections: Array<any>;
    [key: string]: any;
  }>;
}

const { data, error, pending } = await useFetch<PageTest>(
  `${config.public.strapiURL}/page-tests`,
  {
    params: {
      'filters[slug][$eq]': 'accueil', // Clés entre guillemets si elles contiennent des caractères spéciaux
      'populate[sections][populate]': '*', // Ou mieux, un objet/tableau pour peupler spécifiquement
      // Exemple de populate plus spécifique (nécessite souvent un module comme qs ou la gestion par @nuxtjs/strapi)
      // populate: {
      //   sections: {
      //     populate: ['titre', 'texte', 'image', 'bouton_text', 'bouton_lien']
      //   }
      // }
    },
  }
);

const home = computed(() => data.value?.data?.[0] ?? null);

function getImageUrl(block: any) {
  if (block.__component === 'section.image' && block.Image?.url) {
    return config.public.strapiURL.replace('/api', '') + block.Image.url;
  }
  return null;
}

function getSectionByType(type: string) {
  return home.value?.sections?.find((s: any) => s.__component === type) ?? null;
}

const heroSection = computed(() => {
  const result = getSectionByType('section.hero');
  return result;
});

const sideImageSection = computed(() => {
  const result = getSectionByType('section.texte-image');
  return result;
});

const heroImageUrl = computed(() => {
  const imageObject = heroSection.value?.image;
  const relativeUrl = imageObject?.url;

  if (relativeUrl) {
    const baseUrl = config.public.strapiURL.replace('/api', '');
    return baseUrl + relativeUrl;
  }
  return null;
});

const sideImageUrl = computed(() => {
  const imageObject = sideImageSection.value?.image;
  const relativeUrl = imageObject?.url;

  if (relativeUrl) {
    const baseUrl = config.public.strapiURL.replace('/api', '');
    return baseUrl + relativeUrl;
  }
  return null;
});
</script>

<style>
/* État initial (avant l'entrée) */
.fade-enter-from {
  opacity: 0; /* Équivalent à @apply opacity-0; */
}

/* État pendant la transition d'entrée */
.fade-enter-active {
  transition-property: opacity;
  transition-duration: 2000ms;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.fade-enter-to {
  opacity: 1;
}
</style>
