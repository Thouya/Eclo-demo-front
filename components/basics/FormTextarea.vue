<template>
  <div class="grid w-full gap-1.5">
    <Label :for="id">{{ label }}</Label>
    <Textarea :id="id" :placeholder="placeholder" :required="required" />
  </div>
</template>

<script setup lang="ts">
import Label from '../ui/label/Label.vue';
import Textarea from '../ui/textarea/Textarea.vue';

const props = defineProps<{
  label: string;
  id: string;
  placeholder: string;
  size: string;
  required: boolean;
  error: string;
  empty: string;
}>();
</script>

<style scoped></style>
