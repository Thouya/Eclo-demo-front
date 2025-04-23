<template>
  <div>
    <component
      v-for="(block, index) in document"
      :key="index"
      :is="resolveNode(block)"
      v-bind="getProps(block)"
    >
      <template v-if="block.children">
        <RichTextRenderer
          :document="block.children"
          :customClasses="customClasses"
        />
      </template>
      <template v-else-if="block.text != null">
        <span v-if="block.bold" :class="customClasses?.['bold'] || ''">{{
          block.text
        }}</span>
        <span
          v-else-if="block.italic"
          :class="customClasses?.['italic'] || ''"
          >{{ block.text }}</span
        >
        <span
          v-else-if="block.underline"
          :class="customClasses?.['underline'] || ''"
          >{{ block.text }}</span
        >
        <template v-else>{{ block.text }}</template>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  document: any[];
  customClasses?: Record<string, string>;
}>();

const resolveNode = (block: any): string => {
  switch (block.type) {
    case 'paragraph':
      return 'p';
    case 'heading':
      const level =
        typeof block.level === 'number' && block.level >= 1 && block.level <= 6
          ? block.level
          : 2;
      return `h${level}`;
    case 'list':
      return block.format === 'ordered' ? 'ol' : 'ul';
    case 'listItem':
      return 'li';
    case 'quote':
      return 'blockquote';
    case 'text':
      return 'span';
    default:
      return 'div';
  }
};

const getProps = (block: any) => {
  const blockClass = props.customClasses?.[block.type] || '';
  return {
    class: blockClass,
  };
};
</script>
