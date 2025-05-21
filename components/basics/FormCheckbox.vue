<template>
  <!-- Le FormField principal pour le groupe de checkboxes -->
  <FormField :name="props.id" v-slot="{ field, errors }">
    <FormItem>
      <div class="mb-4">
        <FormLabel class="text-base"> {{ label }} </FormLabel>
        <FormDescription v-if="description">
          {{ description }}
        </FormDescription>
      </div>

      <!-- Boucle sur les options pour créer chaque checkbox -->
      <div
        v-for="option in options"
        :key="option.id"
        class="flex items-center space-x-3 mb-2"
      >
        <FormControl>
          <Checkbox
            :id="`${props.id}-${option.id}`"
            :value="option.id"
            :checked="modelValue?.includes(option.id)"
            @update:checked="
              (checkedState: boolean | 'indeterminate') =>
                handleCheckboxChange(checkedState, option.id, field)
            "
            :required="required && (!modelValue || modelValue.length === 0)"
            :aria-describedby="
              errors.length ? `${props.id}-form-item-message` : undefined
            "
          />
        </FormControl>
        <FormLabel
          :for="`${props.id}-${option.id}`"
          class="font-normal cursor-pointer"
        >
          {{ option.label }}
        </FormLabel>
      </div>
      <!-- Afficher le message d'erreur global pour le groupe -->
      <FormMessage :id="`${props.id}-form-item-message`" />
      <!-- Ou un message d'erreur personnalisé si props.error est fourni -->
      <p v-if="props.error && !errors.length" class="text-sm text-red-500 mt-1">
        {{ props.error }}
      </p>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { Checkbox } from '../ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

// Modèle pour v-model sur le composant FormCheckbox lui-même
// Il contiendra un tableau des IDs des options cochées
const modelValue = defineModel<string[]>({ default: () => [] }); // Initialiser avec un tableau vide

const props = defineProps<{
  label: string;
  id: string; // ID de base pour le groupe de checkboxes, utilisé aussi comme 'name' pour FormField
  description?: string;
  // size: string; // La prop size n'est généralement pas standard pour les checkboxes shadcn
  required?: boolean;
  error?: string; // Pour afficher un message d'erreur personnalisé
  options: {
    id: string;
    label: string;
  }[];
}>();

// Gère le changement d'état d'une checkbox individuelle
function handleCheckboxChange(
  checked: boolean | 'indeterminate',
  optionId: string,
  fieldApi: any
) {
  // On ne gère que les états booléens (checked/unchecked)
  if (typeof checked === 'boolean') {
    // S'assurer que modelValue.value est un tableau
    const currentValue = Array.isArray(modelValue.value)
      ? [...modelValue.value]
      : [];

    if (checked) {
      if (!currentValue.includes(optionId)) {
        currentValue.push(optionId);
      }
    } else {
      const index = currentValue.indexOf(optionId);
      if (index > -1) {
        currentValue.splice(index, 1);
      }
    }
    modelValue.value = currentValue; // Met à jour le v-model du composant FormCheckbox

    // Informe le FormField parent du changement (si vee-validate est utilisé par shadcn-vue)
    if (fieldApi && typeof fieldApi.handleChange === 'function') {
      fieldApi.handleChange(modelValue.value);
    } else if (fieldApi && typeof fieldApi.setValue === 'function') {
      // Autre API possible pour FormField
      fieldApi.setValue(modelValue.value);
    }
  }
}
</script>

<style scoped></style>
