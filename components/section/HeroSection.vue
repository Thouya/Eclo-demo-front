<template>
  <Transition name="fade" appear>
    <div
      :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
      class="hero-container h-[95vh] flex flex-col justify-center items-center bg-cover bg-center rounded-4xl m-[1%] p-[5%]"
    >
      <div class="hero-title">
        <h1 class="h1 uppercase font-bold text-center">
          {{ title }}
        </h1>
      </div>
      <div class="hero-text text-white">
        <RichTextRenderer
          v-if="textDocument"
          :document="textDocument"
          :customClasses="richTextClasses"
          class="text-center text-white"
        />
      </div>
      <a
        :href="buttonLink"
        class="px-6 mb-[15%] py-2 bg-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
      >
        {{ buttonText }}
      </a>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import RichTextRenderer from '~/components/fonction/RichTextRenderer.vue';

const props = defineProps<{
  title: string;
  textDocument: any[] | null; // Type du document Rich Text
  backgroundImageUrl: string | null;
  buttonText: string;
  buttonLink: string;
}>();

const richTextClasses = {
  paragraph: 'text-white text-xl font-light mb-6',
  heading: 'text-white font-bold my-6 text-2xl',
  list: 'pl-5 list-disc text-white',
  listItem: 'mb-2 text-white',
  quote: 'border-l-4 pl-4 italic text-white border-white-300',
  bold: 'font-bold text-white',
};
</script>
