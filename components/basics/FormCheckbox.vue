<template>
  <!-- Le FormField principal pour le groupe de checkboxes -->
  <FormField
    :name="props.id"
    v-slot="{ value: groupValue, handleChange: groupHandleChange, errors }"
  >
    <FormItem>
      <div class="mb-4">
        <FormLabel class="text-base"> {{ label }} </FormLabel>
        <FormDescription v-if="description">
          {{ description }}
        </FormDescription>
      </div>

      <!-- Boucle sur les options -->
      <FormField
        v-for="option in options"
        :key="option.id"
        type="checkbox"
        :value="option.id"
        :checked="groupValue?.includes(option.id)"
        :name="props.id"
        v-slot="{ value: checkboxValue, handleChange: checkboxHandleChange }"
      >
        <FormItem class="flex flex-row items-start space-x-3 space-y-0 mb-2">
          <FormControl>
            <Checkbox
              :checked="checkboxValue?.includes(option.id)"
              @update:checked="checkboxHandleChange"
              :required="required && (!groupValue || groupValue.length === 0)"
              :aria-describedby="
                errors.length
                  ? `${props.id}-${option.id}-form-item-message`
                  : undefined
              "
            />
          </FormControl>
          <FormLabel class="font-normal cursor-pointer">
            {{ option.label }}
          </FormLabel>
        </FormItem>
      </FormField>

      <FormMessage :id="`${props.id}-form-item-message`" />
      <!-- Message d'erreur global pour le groupe -->
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

const props = defineProps<{
  label: string;
  id: string; // Utilisé comme 'name' pour les FormFields
  description?: string;
  required?: boolean;
  error?: string;
  options: {
    id: string;
    label: string;
  }[];
}>();

// J'ai aussi ajusté l'aria-describedby pour qu'il soit potentiellement unique si besoin,
// bien que le FormMessage global soit probablement suffisant.
// L'ID pour aria-describedby sur la checkbox devrait pointer vers l'ID du FormMessage qui affiche l'erreur.
// Si FormMessage a un ID auto-généré, il faudrait le récupérer.
// Pour l'instant, on peut simplifier :
// :aria-describedby="errors.length ? `${props.id}-form-item-message` : undefined"
// et s'assurer que le FormMessage a bien cet ID.
</script>

<style scoped></style>
