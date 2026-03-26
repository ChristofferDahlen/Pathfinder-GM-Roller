<script setup lang="ts">

import type {iCharacter} from "../../ts/types";
import {ref} from "vue";

const char = defineModel<iCharacter>({ required: true });

const newLanguage = ref("")


function addLanguage() {
  console.log(char.value.languages)
  char.value.languages.push(newLanguage.value)
  newLanguage.value = ""
}

function removeLanguage(iRes: number) {
  char.value.languages.splice(iRes, 1);
}


</script>


<template>
  <Panel toggleable header="Languages" class="overflow-scroll">
    <ul>
      <li v-for="(res, ir) in char.languages" :key="'res_' + ir" class="p-0">
        <InputText
            v-model="char.languages[ir]" placeholder="Type" pt:root:class="pt_rv_text"
            class="rv_text"/>
        <Button class="rv_button" @click="removeLanguage(ir)">
          <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"/>
        </Button>
      </li>
      <li class="p-0">
        <InputText
            v-model="newLanguage" placeholder="Type" pt:root:class="pt_rv_text"
            class="rv_text"/>

        <Button class="rv_button" @click="addLanguage()">
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
