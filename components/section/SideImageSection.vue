<template>
  <div
    :class="[
      'sideImageContainer flex flex-row items-center justify-between gap-32 px-32 mt-16',
      ImagePosition === 'gauche' ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <div class="sideImageTextContainer flex-1">
      <div class="h2 sideImageTitle mb-4">{{ title }}</div>
      <div class="body sideImageText">
        <RichTextRenderer
          v-if="textDocument"
          :document="textDocument"
          :customClasses="richTextClasses"
          class="text-left text-black"
        />
      </div>
    </div>
    <div class="sideImage flex-1">
      <img
        :src="ImageUrl ?? ''"
        alt="Image"
        class="rounded-4xl w-full object-cover h-[50vh]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RichTextRenderer from '~/components/fonction/RichTextRenderer.vue';

const props = defineProps<{
  title: string;
  textDocument: any[] | null; // Type du document Rich Text
  ImageUrl: string | null;
  ImagePosition: string; //
}>();

const richTextClasses = {
  paragraph: 'text-black text-xl font-light mb-6',
  heading: 'text-black font-bold my-6 text-2xl',
  list: 'pl-5 list-disc text-white',
  listItem: 'mb-2 text-black',
  quote: 'border-l-4 pl-4 italic text-black border-white-300',
  bold: 'font-bold text-black',
};
</script>
