<script setup lang="ts">
import type {iCharacter} from "../../ts/types";
import {ref} from "vue";

const char = defineModel<iCharacter>({ required: true });

const newResName = ref("")
const newResValue = ref(0)
const newVulName = ref("")
const newVulValue = ref(0)

function addRes() {
  if (!newResName.value.trim()) return
  char.value.resistances.push({ name: newResName.value.trim(), value: newResValue.value })
  newResName.value = ""
  newResValue.value = 0
}

function removeRes(i: number) { char.value.resistances.splice(i, 1) }

function addVul() {
  if (!newVulName.value.trim()) return
  char.value.vulnerabilities.push({ name: newVulName.value.trim(), value: newVulValue.value })
  newVulName.value = ""
  newVulValue.value = 0
}

function removeVul(i: number) { char.value.vulnerabilities.splice(i, 1) }
</script>

<template>
  <Panel toggleable header="Resistances & Vulnerabilities">

    <div class="section-label">Resistances</div>
    <div class="flex flex-wrap gap-1 mb-2">
      <span v-for="(r, i) in char.resistances" :key="'res_' + i" class="chip chip-res">
        {{ r.name }} {{ r.value }}
        <button class="chip-remove" @click="removeRes(i)">×</button>
      </span>
    </div>
    <div class="flex gap-1 mb-3">
      <InputText v-model="newResName" size="small" placeholder="Type" style="width:8rem"
                 @keydown.enter.prevent="addRes"/>
      <InputText v-model.number="newResValue" type="number" size="small" style="width:3.5rem; text-align:center" min="0" max="999" />
      <Button size="small" outlined @click="addRes">
        <MdiIcon icon="mdiPlus" size="12pt"/>
      </Button>
    </div>

    <div class="section-label">Vulnerabilities</div>
    <div class="flex flex-wrap gap-1 mb-2">
      <span v-for="(v, i) in char.vulnerabilities" :key="'vul_' + i" class="chip chip-vul">
        {{ v.name }} {{ v.value }}
        <button class="chip-remove" @click="removeVul(i)">×</button>
      </span>
    </div>
    <div class="flex gap-1">
      <InputText v-model="newVulName" size="small" placeholder="Type" style="width:8rem"
                 @keydown.enter.prevent="addVul"/>
      <InputText v-model.number="newVulValue" type="number" size="small" style="width:3.5rem; text-align:center" min="0" max="999"/>
      <Button size="small" outlined @click="addVul">
        <MdiIcon icon="mdiPlus" size="12pt"/>
      </Button>
    </div>

  </Panel>
</template>

<style scoped lang="scss">
.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  color: white;
}

.chip-res { @apply bg-green-900 border border-green-700; }
.chip-vul { @apply bg-red-900 border border-red-700; }

.chip-remove {
  font-size: 0.9rem;
  line-height: 1;
  opacity: 0.6;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  &:hover { opacity: 1; }
}
</style>
