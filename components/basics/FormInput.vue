<template>
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label :for="id">{{ label }}</Label>
    <Input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :aria-required="required"
    />
  </div>
</template>

<script setup lang="ts">
import Input from '../ui/input/Input.vue';
import Label from '../ui/label/Label.vue';

const props = defineProps<{
  label: string;
  id: string;
  type: string;
  placeholder: string;
  size: string;
  required: boolean;
  error: string;
  empty: string;
}>();
</script>

<style scoped></style>
