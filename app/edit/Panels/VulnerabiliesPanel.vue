<script setup lang="ts">
import type {iCharacter} from "../../ts/types";
import {ref} from "vue";

const char = defineModel<iCharacter>({ required: true });
const newName = ref("")
const newValue = ref(0)

function add() {
  if (!newName.value.trim()) return
  char.value.vulnerabilities.push({ name: newName.value.trim(), value: newValue.value })
  newName.value = ""
  newValue.value = 0
}

function remove(i: number) {
  char.value.vulnerabilities.splice(i, 1)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") { e.preventDefault(); add() }
}
</script>

<template>
  <Panel toggleable header="Vulnerabilities">
    <div class="flex flex-wrap gap-1 mb-2">
      <span v-for="(v, i) in char.vulnerabilities" :key="'vul_' + i" class="rv-chip">
        {{ v.name }} {{ v.value }}
        <button class="chip-remove" @click="remove(i)">×</button>
      </span>
    </div>
    <div class="flex gap-1">
      <InputText v-model="newName" size="small" placeholder="Type" style="width:8rem" @keydown="onKeydown"/>
      <input v-model.number="newValue" type="number" min="0" max="30" class="value-input"/>
      <Button size="small" outlined @click="add">
        <MdiIcon icon="mdiPlus" size="12pt"/>
      </Button>
    </div>
  </Panel>
</template>

<style scoped lang="scss">
.rv-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  @apply bg-red-900 border border-red-700 text-white;
}

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

.value-input {
  width: 3.5rem;
  text-align: center;
  border-radius: 0.375rem;
  padding: 0.25rem 0.375rem;
  font-size: 0.875rem;
  @apply bg-neutral-200 dark:bg-surface-700 border border-neutral-400 dark:border-surface-500 text-inherit;
}
</style>
