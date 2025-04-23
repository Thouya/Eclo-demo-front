<template>
  <div v-if="heroSection">
    {{ heroSection.titre }}
    <img v-if="heroImageUrl" :src="heroImageUrl" alt="Hero Image" class="" />
  </div>
  <div v-else>Aucun titre disponible pour section.hero</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

interface PageTest {
  data: Array<{
    sections: Array<any>;
    [key: string]: any;
  }>;
}

const { data } = await useFetch<PageTest>(
  `${config.public.strapiURL}/page-tests?filters[slug][$eq]=accueil&populate[sections][populate]=*`
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

  // 3. Vérifier si l'URL relative existe
  if (relativeUrl) {
    const baseUrl = config.public.strapiURL.replace('/api', '');
    return baseUrl + relativeUrl;
  }
  return null;
});

console.log(heroImageUrl);
</script>
