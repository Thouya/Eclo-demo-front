<template>
  <div>
    <component
      v-for="(block, index) in document"
      :key="index"
      :is="resolveNode(block)"
      v-bind="getProps(block)"
    >
      <template v-if="block.children">
        <RichTextRenderer :document="block.children" />
      </template>
      <template v-else-if="block.text">
        {{ block.text }}
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  document: any[];
}>();

const resolveNode = (block: any) => {
  switch (block.type) {
    case 'paragraph':
      return 'p';
    case 'heading':
      return `h${block.level || 2}`;
    case 'list':
      return block.format === 'ordered' ? 'ol' : 'ul';
    case 'listItem':
      return 'li';
    case 'quote':
      return 'blockquote';
    default:
      return 'div';
  }
};

const getProps = (block: any) => {
  const classMap: Record<string, string> = {
    paragraph: 'mb-4 text-gray-800',
    heading: 'font-bold my-4 text-xl',
    list: 'pl-5 list-disc',
    listItem: 'mb-1',
    quote: 'border-l-4 pl-4 italic text-gray-600 border-gray-300',
  };
  return {
    class: classMap[block.type] || '',
  };
};
</script>
