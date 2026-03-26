<script setup lang="ts">
import type {iCharacter} from "../../ts/types";

const char = defineModel<iCharacter>({ required: true });
</script>

<template>
  <Panel toggleable header="Defense">
    <div class="flex flex-col gap-2 text-sm">
      <div class="flex items-center gap-2">
        <span class="w-14 opacity-70">AC</span>
        <InputNumber
            v-model="char.protection.ac" show-buttons
            button-layout="horizontal" size="small"
            style="width: 7.5rem" 
            :min="0" :max="60" fluid>
          <template #incrementbuttonicon><MdiIcon size="12pt" icon="mdiPlus"/></template>
          <template #decrementbuttonicon><MdiIcon size="12pt" icon="mdiMinus"/></template>
        </InputNumber>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-14 opacity-70">Shield</span>
        <InputNumber
            v-model="char.protection.shield" show-buttons
            button-layout="horizontal" size="small"
            style="width: 7.5rem" 
            :min="0" :max="30" fluid>
          <template #incrementbuttonicon><MdiIcon size="12pt" icon="mdiPlus"/></template>
          <template #decrementbuttonicon><MdiIcon size="12pt" icon="mdiMinus"/></template>
        </InputNumber>
      </div>
    </div>
  </Panel>
</template>
