<script setup lang="ts">

import type {iCharacter} from "../../ts/types";
import {attrFullname, Attribute} from "../../ts/types";
import {getPrefix} from "../../ts/rolling";


const char = defineModel<iCharacter>({ required: true });

</script>


<template>
  <Panel toggleable header="Attributes" class="">
    <div v-for="a in Attribute" :key="'edit_char_attr_' + a" class="grid grid-cols-2 w-fit">
      <span class="inline-block p-2">{{ attrFullname[a] }}</span>
      <InputNumber
          v-model="char.attributes[a]" class="number"
          :prefix="getPrefix(char.attributes[a])" show-buttons button-layout="horizontal" fluid
          :min="-9" :max="9">
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
