<script setup lang="ts">
import {capitalize, onMounted, onUnmounted, ref} from "vue";
import type {iParty} from "../ts/types";
import {getClassColor} from "../ts/classColors";

const isDark = computed(() => document.documentElement.classList.contains('dark'));

const allParties = ref<Array<iParty>>([]);
const currentParty = defineModel<iParty>({ required: true });

function getSavedIndex() {
  return allParties.value.findIndex(p => p.name === currentParty.value.name);
}

function sortParties() {
  allParties.value.sort((a, b) => capitalize(a.name) > capitalize(b.name) ? 1 : -1);
}

function save() {
  const copy = JSON.parse(JSON.stringify(currentParty.value));
  const i = getSavedIndex();
  if (i < 0) allParties.value.push(copy);
  else allParties.value[i] = copy;
  sortParties();
  localStorage.setItem("saved_parties", JSON.stringify(allParties.value));
}

function loadParty(party: iParty) {
  currentParty.value = JSON.parse(JSON.stringify(party));
}

function deleteParty(i: number) {
  allParties.value.splice(i, 1);
  localStorage.setItem("saved_parties", JSON.stringify(allParties.value));
}

onMounted(() => {
  try {
    const stored = localStorage.getItem("saved_parties");
    if (stored) allParties.value = JSON.parse(stored);
  } catch { allParties.value = []; }
});

onUnmounted(() => {
  localStorage.setItem("saved_parties", JSON.stringify(allParties.value));
});
</script>

<template>
  <div class="party-save">

    <!-- Current party -->
    <div class="current-panel">
      <div class="panel-header">Current Party</div>
      <div class="flex flex-col gap-3">
        <InputText v-model="currentParty.name" size="small" placeholder="Party name" class="w-full"/>
        <div class="char-list">
          <div v-for="char in currentParty.characters" :key="char.name" class="char-chip"
               :style="getClassColor(char.class, isDark)
                 ? { backgroundColor: getClassColor(char.class, isDark), borderColor: getClassColor(char.class, isDark), color: isDark ? '#1f2937' : '#e5e7eb' }
                 : {}">
            <span class="font-medium">{{ char.name }}</span>
            <span class="text-xs ml-1 opacity-70">{{ char.class }} {{ char.level }}</span>
          </div>
        </div>
        <Button size="small" class="w-full" @click="save">
          <MdiIcon icon="mdiContentSave" class="mr-2"/>
          Save Party
        </Button>
      </div>
    </div>

    <!-- Saved parties -->
    <div class="saved-panel">
      <div class="panel-header">Saved Parties</div>
      <div v-if="allParties.length === 0" class="empty-state">No saved parties yet</div>
      <div v-else class="party-list">
        <div v-for="(party, i) in allParties" :key="i" class="party-row">
          <div class="party-info">
            <div class="party-name">{{ party.name }}</div>
            <div class="char-chips">
              <span v-for="char in party.characters" :key="char.name" class="char-chip small"
                    :style="getClassColor(char.class, isDark)
                      ? { backgroundColor: getClassColor(char.class, isDark), borderColor: getClassColor(char.class, isDark), color: isDark ? '#1f2937' : '#e5e7eb' }
                      : {}">
                {{ char.name }}
                <span class="text-xs opacity-70">{{ char.class }} {{ char.level }}</span>
              </span>
            </div>
          </div>
          <div class="party-actions">
            <Button size="small" outlined @click="loadParty(party)">
              <MdiIcon icon="mdiDownload" size="14pt"/>
            </Button>
            <Button size="small" outlined severity="danger" @click="deleteParty(i)">
              <MdiIcon icon="mdiDelete" size="14pt"/>
            </Button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.party-save {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1rem;
  min-height: 400px;
}

.panel-header {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin-bottom: 0.75rem;
}

.current-panel, .saved-panel {
  @apply bg-neutral-200 dark:bg-surface-800 border border-neutral-400 dark:border-surface-600;
  border-radius: 0.5rem;
  padding: 1rem;
}

.char-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  min-height: 2rem;
}

.char-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  @apply bg-neutral-300 dark:bg-surface-700 border border-neutral-400 dark:border-surface-500;

  &.small {
    font-size: 0.75rem;
    padding: 0.1rem 0.5rem;
  }
}

.party-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.party-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  @apply bg-neutral-300 dark:bg-surface-700 border border-neutral-400 dark:border-surface-600;
}

.party-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
}

.char-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.party-actions {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex-shrink: 0;
}

.empty-state {
  opacity: 0.4;
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem 0;
}
</style>

