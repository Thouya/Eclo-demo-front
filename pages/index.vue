<template>
  <ClientOnly>
    <Transition name="fade" appear>
      <div
        v-if="heroSection"
        :style="{ backgroundImage: `url(${heroImageUrl})` }"
        class="hero-container h-[95vh] flex flex-col justify-center items-center bg-cover bg-center rounded-4xl m-[1%] p-[5%]"
      >
        <div class="hero-title">
          <h1 class="h1 uppercase font-bold text-center">
            {{ heroSection.titre }}
          </h1>
        </div>
        <div class="hero-text text-white">
          <RichTextRenderer
            v-if="heroSection.texte"
            :document="heroSection.texte"
            :customClasses="richTextClasses"
            class="text-center text-white"
          />
        </div>
        <a
          :href="heroSection.bouton_lien"
          class="px-6 mb-[15%] py-2 bg-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
        >
          {{ heroSection.bouton_text }}
        </a>
      </div>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import RichTextRenderer from '~/components/fonction/RichTextRenderer.vue';

const config = useRuntimeConfig();

// Define custom classes for rich text elements
const richTextClasses = {
  paragraph: 'text-white text-xl font-light mb-6',
  heading: 'text-white font-bold my-6 text-2xl',
  list: 'pl-5 list-disc text-white',
  listItem: 'mb-2 text-white',
  quote: 'border-l-4 pl-4 italic text-white border-white-300',
  bold: 'font-bold text-white',
};

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

const heroImageUrl = computed(() => {
  const imageObject = heroSection.value?.image;
  const relativeUrl = imageObject?.url;

  if (relativeUrl) {
    const baseUrl = config.public.strapiURL.replace('/api', '');
    return baseUrl + relativeUrl;
  }
  return null;
});

console.log(heroImageUrl);
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
