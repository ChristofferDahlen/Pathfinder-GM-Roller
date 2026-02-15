<script setup lang="ts">

import {iCharacter} from "../../ts/types";

const props = defineProps<{char : iCharacter}>()

</script>

<template>
  <Panel toggleable header="Defense">
    <div class="">
      <span class="inline-block p-2 w-16">AC</span>
      <InputNumber class="number" v-model="char.protection.ac" showButtons
                   buttonLayout="horizontal" fluid :min="0" :max="30">
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
      <InputNumber class="number" v-model="char.protection.shield" showButtons
                   buttonLayout="horizontal" fluid :min="0" :max="30">
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
