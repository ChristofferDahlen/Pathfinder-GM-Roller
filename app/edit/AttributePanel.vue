<script setup lang="ts">

import {attrFullname, Attribute, iCharacter} from "../ts/types";
import {getPrefix} from "../ts/rolling";

const props = defineProps<{char : iCharacter}>()

</script>


<template>
  <Panel toggleable header="Attributes" class="">
    <div v-for="a in Attribute" class="grid grid-cols-2 w-fit" :key="'edit_char_' + i + '_attr_' + a">
      <span class="inline-block p-2">{{ attrFullname[a] }}</span>
      <InputNumber class="number" v-model="char.attributes[a]"
                   :prefix="getPrefix(char.attributes[a])" showButtons buttonLayout="horizontal" fluid
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
