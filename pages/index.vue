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

    <CarouselSection
      v-if="carouselItems && carouselItems.length"
      :items="carouselItems"
      :items-to-show-default="4"
      :items-to-show-small-screen="2"
      :loop="true"
      gap-size="8px"
      container-width-class="w-[90%]"
      class="my-8"
    />
    <div v-else-if="pending">Chargement du carrousel...</div>

    <div
      class="kpis-container flex justify-center flex-wrap gap-8 mt-16 mb-16 w-[90%] mx-auto lg:flex-nowrap"
    >
      <KPISection
        v-for="kpi in kpiSectionData"
        :key="kpi.id"
        class="basis-full sm:basis-1/2 lg:basis-1/3"
        :number="kpi.valeur"
        :text="kpi.libelle"
      />
    </div>

    <FormSection />
  </ClientOnly>
</template>

<script setup lang="ts">
import HeroSection from '~/components/section/HeroSection.vue';
import SideImageSection from '~/components/section/SideImageSection.vue';
import CarouselSection from '~/components/section/CarouselSection.vue';
import KPISection from '~/components/section/KPISection.vue';
import FormSection from '~/components/section/FormSection.vue';

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

const carouselSectionData = computed(() => {
  const result = getSectionByType('section.carousel');
  return result;
});

const kpiSectionData = computed(() => {
  const result = getSectionByType('section.chiffres');
  return result?.statistiques || [];
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

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  // ... autres champs de l'image Strapi
}

interface StrapiLegend {
  id: number;
  texte: string;
}

const carouselItems = computed(() => {
  const images = carouselSectionData.value?.images as StrapiImage[] | undefined;
  const legends = carouselSectionData.value?.legendes as
    | StrapiLegend[]
    | undefined;

  if (!images || images.length === 0) {
    return [];
  }

  return images.map((img, index) => {
    const baseUrl = config.public.strapiURL.replace('/api', '');
    return {
      url: baseUrl + img.url,
      alt: img.alternativeText || `Image du carrousel ${index + 1}`,
      legend: legends?.[index]?.texte || '', // Associe la légende par index
    };
  });
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
