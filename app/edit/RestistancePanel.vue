<template>
  <Panel toggleable header="Resistances" class="overflow-scroll">
    <ul>
      <li v-for="(res, ir) in char.resistances" class="p-1" :key="'res_' + ir">
        <InputText v-model="res.name" placeholder="Type" pt:root:class="pt_rv_text"
                   class="rv_text"></InputText>
        <InputNumber class="rv_field " v-model="res.value" fluid
                     :min="0" :max="30">
        </InputNumber>
        <Button class="rv_button" @click="removeResistance(i, ir)">
          <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"></MdiIcon>
        </Button>
      </li>
      <li class="p-1">
        <InputText v-model="newResistance" placeholder="Type" pt:root:class="pt_rv_text"
                   class="rv_text"></InputText>
        <InputNumber class="rv_field " v-model="newResistanceValue" fluid
                     :min="0" :max="30">
        </InputNumber>
        <Button class="rv_button" @click="addResistance(i)">
          <MdiIcon icon="mdiPlus" size="12pt" class="p-0 m-0"></MdiIcon>
        </Button>
      </li>
    </ul>
  </Panel>
</template>
<script setup lang="ts">

import {iCharacter} from "../ts/types";

const props = defineProps<{char : iCharacter, i: number}>()

</script>
<style scoped lang="scss">

.rv_text {
  width: 40%;
  height: 1.75rem;
  margin: 0.1rem;

  @apply align-middle;
  text-align: center;
  padding: 0;
}

.rv_field {
  height: 1.75rem;
  width: 20%;
  margin: 0.1rem;

  @apply align-middle;

}

.rv_button {
  height: 1.5rem;
  @apply align-middle;
  margin: 0.1rem;

}


</style>
