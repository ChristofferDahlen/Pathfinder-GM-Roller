<template>
  <Panel toggleable header="Vulnerabilities" class="overflow-scroll">
    <ul>
      <li v-for="(vul, ir) in char.vulnerabilities" class="p-1" :key="'vul_' + ir">
        <InputText v-model="vul.name" placeholder="Type" pt:root:class="pt_rv_text"
                   class="rv_text"></InputText>
        <InputNumber class="rv_field " v-model="vul.value" fluid
                     :min="0" :max="30">
        </InputNumber>
        <Button class="rv_button" @click="removeVulnerability(ir)">
          <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"></MdiIcon>
        </Button>
      </li>
      <li class="p-1">
        <InputText v-model="newVulnerability" placeholder="Type" pt:root:class="pt_rv_text"
                   class="rv_text"></InputText>
        <InputNumber class="rv_field text-center " v-model="newVulnerabilityValue" fluid
                     :min="0" :max="30">
        </InputNumber>
        <Button class="rv_button" @click="addVulnerability()">
          <MdiIcon icon="mdiPlus" size="12pt" class="p-0 m-0"></MdiIcon>
        </Button>
      </li>
    </ul>
  </Panel>
</template>
<script setup lang="ts">

import {iCharacter} from "../../ts/types";
import {ref} from "vue";

const props = defineProps<{char : iCharacter}>()

const newVulnerability = ref("")
const newVulnerabilityValue = ref(0)


function addVulnerability() {
  props.char.vulnerabilities.push({name: newVulnerability.value, value: newVulnerabilityValue.value})
  newVulnerability.value = ""
  newVulnerabilityValue.value = 0
}

function removeVulnerability(iRes: number) {
  props.char.vulnerabilities.splice(iRes, 1);
}


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
