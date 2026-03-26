<script setup lang="ts">
import {OrganizedSettings, OrganizedShortCuts, RollerShortcuts, type shortcutsEnum} from "./ts/settings";
import {watch} from "vue";

const defenses = ref<number[]>([0, 1, 2, 3])
const shortcutGroups = ref<number[]>([0, 1, 2, 3])
const visible = ref<boolean>(false);
const editingShortcut = ref<shortcutsEnum>();
const shortcutToAdd = ref<string>();

const RESERVED_KEYS = ["F5", "Ctrl+R", "Ctrl+Tab", "Alt+Tab"];

const normalizeKey = (key: string) => {
  switch (key) {
    case " ": return "Space";
    case "Enter": return "Enter";
    case "Backspace": return "Backspace";
    case "Control": return "Ctrl";
    default: return key;
  }
};

const handler = (event: KeyboardEvent) => {
  const keyCombination = (event.key === "Control" || event.key === "Alt" || event.key === "Shift")
    ? normalizeKey(event.key)
    : `${event.ctrlKey ? "Ctrl+" : ""}${event.altKey ? "Alt+" : ""}${event.shiftKey ? "Shift+" : ""}${normalizeKey(event.key)}`;

  if (RESERVED_KEYS.includes(keyCombination)) return;
  shortcutToAdd.value = keyCombination;
  event.preventDefault();
};

function UpdateShortcuts(a: shortcutsEnum) {
  visible.value = true;
  editingShortcut.value = a.toString();
  shortcutToAdd.value = RollerShortcuts.value[a];
}

watch(visible, (newVal) => {
  if (newVal) addEventListener('keydown', handler);
  else { removeEventListener('keydown', handler); shortcutToAdd.value = ""; }
});

function SaveShortcut() {
  for (const key in RollerShortcuts.value) {
    if (key === editingShortcut.value) continue;
    if (RollerShortcuts.value[key] === shortcutToAdd.value)
      RollerShortcuts.value[key] = "...";
  }
  RollerShortcuts.value[editingShortcut.value] = shortcutToAdd.value;
  visible.value = false;
}

const warningText = computed(() => {
  for (const key in RollerShortcuts.value) {
    if (key !== editingShortcut.value && RollerShortcuts.value[key] === shortcutToAdd.value)
      return "Overrides: " + key;
  }
  return "";
});
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Edit Shortcut">
    <div class="flex flex-col gap-3 p-2">
      <div class="text-sm font-semibold opacity-70">{{ editingShortcut }}</div>
      <div class="flex gap-2">
        <InputText v-model="shortcutToAdd" size="small" class="flex-1" placeholder="Press a key..."/>
        <Button size="small" :disabled="!shortcutToAdd" @click="SaveShortcut">
          <MdiIcon icon="mdiCheck"/>
        </Button>
      </div>
      <div v-if="warningText" class="flex items-center gap-1 text-xs text-orange-400">
        <MdiIcon icon="mdiAlert" size="14pt"/>
        {{ warningText }}
      </div>
    </div>
  </Dialog>

  <div class="settings-layout">

    <div class="settings-col">
      <div class="col-header">Settings</div>
      <div v-for="(shorts, group, i) in OrganizedSettings" :key="i" class="section">
        <div class="section-label">{{ group }}</div>
        <div v-for="object in shorts" :key="object.name" class="setting-row">
          <span class="text-sm">{{ object.name }}</span>
          <Checkbox v-model="object.state" binary/>
        </div>
      </div>
    </div>

    <div class="divider"/>

    <div class="settings-col">
      <div class="col-header">Shortcuts</div>
      <div v-for="(shorts, group, i) in OrganizedShortCuts" :key="'sc_' + i" class="section">
        <div class="section-label">{{ group }}</div>
        <div v-for="a in shorts" :key="a" class="setting-row">
          <span class="text-sm">{{ a }}</span>
          <button class="shortcut-key" @click="UpdateShortcuts(a)">
            {{ RollerShortcuts[a] }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.settings-layout {
  display: flex;
  gap: 0;
  min-width: 500px;
}

.settings-col {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.col-header {
  font-size: 0.9rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--p-primary-color);
  margin-bottom: 0.25rem;
}

.divider {
  width: 1px;
  @apply bg-neutral-300 dark:bg-surface-700;
  margin: 0.5rem 0;
}

.section {
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  padding-bottom: 0.35rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid;
  @apply border-neutral-300 dark:border-surface-700;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.1rem;
  border-bottom: 1px solid;
  @apply border-neutral-200 dark:border-surface-800;

  &:last-child { border-bottom: none; }
}

.shortcut-key {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 0.25rem;
  border: 1px solid var(--p-primary-color);
  color: var(--p-primary-color);
  background: color-mix(in srgb, var(--p-primary-color), transparent 88%);
  cursor: pointer;
  transition: background 0.15s;
  min-width: 3rem;
  text-align: center;

  &:hover {
    background: color-mix(in srgb, var(--p-primary-color), transparent 75%);
  }
}
</style>
