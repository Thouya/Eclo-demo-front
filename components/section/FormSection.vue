<template>
  <FormInput
    :label="'Label'"
    :id="'Test'"
    :type="'Text'"
    :placeholder="'placeholder'"
    :size="'medium'"
    :required="true"
    :error="''"
    :empty="''"
  />

  <FormTextarea
    :label="'Label'"
    :id="'Test'"
    :placeholder="'placeholder'"
    :size="'medium'"
    :required="true"
    :error="''"
    :empty="''"
  />

  <FormCheckbox
    :label="'Label'"
    :id="'Test'"
    :description="'Description'"
    :size="'medium'"
    :required="true"
    :error="''"
    :empty="''"
    :options="checkoptions"
  />
</template>

<script setup lang="ts">
import { FormInput, FormTextarea, FormCheckbox } from '../basics';

const checkoptions = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];
</script>

<style scoped></style>
