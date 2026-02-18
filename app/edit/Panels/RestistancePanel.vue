<script setup lang="ts">

import type {iCharacter} from "../../ts/types";
import {ref} from "vue";

const char = defineModel<{ char: iCharacter }>();

const newResistance = ref("")
const newResistanceValue = ref(0)


function addResistance() {
  char.value.resistances.push({name: newResistance.value, value: newResistanceValue.value})
  newResistance.value = ""
  newResistanceValue.value = 0
}

function removeResistance(iRes: number) {
  char.value.resistances.splice(iRes, 1);
}


</script>


<template>
  <Panel toggleable header="Resistances" class="overflow-scroll">
    <ul>
      <li v-for="(res, ir) in char.resistances" :key="'res_' + ir" class="p-0">
        <InputText
            v-model="res.name" placeholder="Type" pt:root:class="pt_rv_text"
            class="rv_text"/>
        <InputNumber
            v-model="res.value" class="rv_field " fluid
            :min="0" :max="30"/>
        <Button class="rv_button" @click="removeResistance(i, ir)">
          <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"/>
        </Button>
      </li>
      <li class="p-0">
        <InputText
            v-model="newResistance" placeholder="Type" pt:root:class="pt_rv_text"
            class="rv_text"/>
        <InputNumber
            v-model="newResistanceValue" class="rv_field " fluid
            :min="0" :max="30"/>
        <Button class="rv_button" @click="addResistance()">
          <MdiIcon icon="mdiPlus" size="12pt" class="p-0 m-0"/>
        </Button>
      </li>
    </ul>
  </Panel>
</template>
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
