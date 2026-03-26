<script setup lang="ts">

import type {iCharacter} from "../../ts/types";

const char = defineModel<iCharacter>({ required: true });


</script>

<template>
  <Panel toggleable header="Defense">
    <div class="">
      <span class="inline-block p-2 w-16">AC</span>
      <InputNumber
v-model="char.protection.ac" class="number" show-buttons
                   button-layout="horizontal" fluid :min="0" :max="30">
        <template #incrementbuttonicon>
          <MdiIcon size="14pt" icon="mdiPlus"/>
        </template>
        <template #decrementbuttonicon>
          <MdiIcon size="14pt" icon="mdiMinus"/>
        </template>
      </InputNumber>
    </div>
    <div class="">
      <span class="inline-block p-2 w-16">Shield</span>
      <InputNumber
          v-model="char.protection.shield" class="number" show-buttons
          button-layout="horizontal" fluid :min="0" :max="30">
        <template #incrementbuttonicon>
          <MdiIcon size="14pt" icon="mdiPlus"/>
        </template>
        <template #decrementbuttonicon>
          <MdiIcon size="14pt" icon="mdiMinus"/>
        </template>
      </InputNumber>
    </div>
  </Panel>
</template>

<style scoped lang="scss">

.number {
  width: 8rem;
  font-size: 4rem;
  text-align: center;

}


</style>
