<script setup lang="ts">
import type {iCharacter} from "../../ts/types";
import {ref} from "vue";

const char = defineModel<iCharacter>({ required: true });
const newLanguage = ref("")

function addLanguage() {
  const val = newLanguage.value.trim()
  if (!val) return
  char.value.languages.push(val)
  newLanguage.value = ""
}

function removeLanguage(i: number) {
  char.value.languages.splice(i, 1);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault()
    addLanguage()
  }
}
</script>

<template>
  <Panel toggleable header="Languages">
    <div class="flex flex-wrap gap-1 mb-2">
      <span
          v-for="(lang, i) in char.languages" :key="'lang_' + i"
          class="lang-chip">
        {{ lang }}
        <button class="lang-remove" @click="removeLanguage(i)">×</button>
      </span>
    </div>
    <div class="flex gap-1">
      <InputText
          v-model="newLanguage"
          size="small"
          placeholder="Add language..."
          style="width:10rem"
          @keydown="onKeydown"/>
      <Button size="small" outlined @click="addLanguage">
        <MdiIcon icon="mdiPlus" size="12pt"/>
      </Button>
    </div>
  </Panel>
</template>

<style scoped lang="scss">
.lang-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  @apply bg-neutral-300 dark:bg-surface-700 border border-neutral-400 dark:border-surface-500;
}

.lang-remove {
  font-size: 0.9rem;
  line-height: 1;
  opacity: 0.6;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &:hover { opacity: 1; }
}
</style>
