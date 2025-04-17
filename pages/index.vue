<template>
  <div>
    <HeroSection v-if="hero" v-bind="hero" />
    <TexteImageSection v-if="texteImage" v-bind="texteImage" />
    <ChiffresSection v-if="chiffres" :statistiques="chiffres.statistiques" />
    <CarouselSection v-if="carousel" :images="carousel.images" />
    <p
      v-if="!hero && !texteImage && !chiffres && !carousel"
      class="text-center mt-10 text-red-500"
    >
      Page chargée, mais aucune section correspondante trouvée.
    </p>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/section/HeroSection.vue';
import TexteImageSection from '~/components/section/TexteImageSection.vue';
import ChiffresSection from '~/components/section/ChiffresSection.vue';
import CarouselSection from '~/components/section/CarouselSection.vue';

const strapi = useStrapi();

const { data, error } = await strapi.find('page-tests', {
  filters: {
    slug: { $eq: 'accueil' },
  },
  populate: '*', // Utilisation du wildcard obligatoire pour les composants dynamiques
  pagination: { pageSize: 1 },
});

console.log('✅ Données Strapi :', data);
if (error) console.error('❌ Erreur Strapi :', error);

const page = data?.[0];
console.log('🎯 Page reçue :', page);

const sections = page?.sections ?? [];
console.log('📦 Sections disponibles :', sections);

const hero = sections.find((s: any) => s.__component === 'section.hero');
if (hero?.Titre) hero.titre = hero.Titre;
if (hero?.image) {
  hero.image = {
    url: hero.image.url,
    alternativeText: hero.image.alternativeText || hero.titre,
  };
}

const texteImage = sections.find(
  (s: any) => s.__component === 'section.texte-image'
);
if (texteImage?.Titre) texteImage.titre = texteImage.Titre;
if (texteImage?.texte && typeof texteImage.texte === 'string') {
  texteImage.texte = [
    { type: 'paragraph', children: [{ type: 'text', text: texteImage.texte }] },
  ];
}
if (texteImage?.image_position)
  texteImage.imagePosition = texteImage.image_position;
if (texteImage?.image) {
  texteImage.image = {
    url: texteImage.image.url,
    alternativeText: texteImage.image.alternativeText || texteImage.titre,
  };
}

const chiffres = sections.find(
  (s: any) => s.__component === 'section.chiffres'
);
const carousel = sections.find(
  (s: any) => s.__component === 'section.carousel'
);
</script>
