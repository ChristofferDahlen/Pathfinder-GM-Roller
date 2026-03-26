<script setup lang="ts">

import {onMounted, onUnmounted, ref, watch} from 'vue';
import {newParty, type iParty} from "./ts/types";
import {
  BasicSettings, BasicShortcuts,
  disableShortcuts,
  enableShortcuts,
  OrganizedSettings,
  RollerShortcuts,
} from "./ts/settings";
import PartySave from "./save/PartySave.vue";
import CharEdit from "./edit/charEdit.vue";
import SettingsView from "./SettingsView.vue";
import InfoView from "./InfoView.vue";
import RollTable from "./table/RollTable.vue";
import DCPane from "./pane/DC-pane.vue";

const CHARACTERS_KEY = "Characters";
const SHORTCUTS_KEY = "Shortcuts";
const SETTINGS_KEY = "Settings";

const toggle = ref(false);
const isEditing = ref(false);
const isLoading = ref(true)
const openSettings = ref(false)
const openInfo = ref(false)
const hasPartyChanged = ref(false);

const party = ref<iParty>(newParty());

function generateUniqueKey(): string {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(10)), (byte) =>
      ('0' + byte.toString(16)).slice(-2)
  ).join("");
}

function saveToLocalStorage(key: string, value: unknown): void {
  console.log(`Saving ${key} to localStorage`, value);
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage<T>(key: string, onError: () => T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : onError();
  } catch (error) {
    console.error(`Failed to load ${key}, initializing defaults...`, error);
    return onError();
  }
}

function mergeWithDefaults<T extends object>(stored: T, defaults: T): T {
  const result = { ...defaults };
  for (const key in stored) {
    const storedVal = stored[key];
    const defaultVal = defaults[key];
    if (storedVal && typeof storedVal === 'object' && !Array.isArray(storedVal) &&
        defaultVal && typeof defaultVal === 'object') {
      result[key] = mergeWithDefaults(storedVal as object, defaultVal as object) as T[typeof key];
    } else {
      result[key] = storedVal;
    }
  }
  return result;
}

function toggleCssClass(selector: string, className: string, condition: boolean): void {
  const element = document.querySelector(selector);
  if (element) element.classList.toggle(className, condition);
}


function toggleDarkMode(): void {
  // toggle.value is already updated by ToggleButton before @click fires,
  // so toggle=true means "light mode" (sun icon), toggle=false means "dark mode"
  toggleCssClass('html', 'dark', !toggle.value);
}

function initializePartyKeys(): void {
  party.value.characters.forEach((character) => {
    character.key = generateUniqueKey();
    character.name = character.name ?? "";
  });
}

function dialogOpen(): void {
  disableShortcuts();
}

function dialogClosed(): void {
  enableShortcuts();
  saveToLocalStorage(CHARACTERS_KEY, party.value);
  saveToLocalStorage(SETTINGS_KEY, OrganizedSettings.value);
}


watch(party, () => {
  saveToLocalStorage(CHARACTERS_KEY, party.value)
});



onMounted(() => {
  party.value = loadFromLocalStorage(CHARACTERS_KEY, newParty);
  RollerShortcuts.value = loadFromLocalStorage(SHORTCUTS_KEY, BasicShortcuts);
  OrganizedSettings.value = mergeWithDefaults(
    loadFromLocalStorage(SETTINGS_KEY, BasicSettings),
    BasicSettings()
  );

  initializePartyKeys();

  toggleCssClass('html', 'dark', !toggle.value);
  isLoading.value = false;
});

onUnmounted(() => {
  isLoading.value = true
});
</script>

<template class="dark-mode">

  <div v-if="isLoading" style="position:fixed;inset:0;background:#030712;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;z-index:9999;">LOADING</div>
  <div v-else class="background w-full">
  <ConfirmDialog/>

    <Dialog
        v-model:visible="hasPartyChanged" modal header="Save / Load Party" :style="{ width:'98%'}"
        @show="dialogOpen()"
        @after-hide="dialogClosed()">
      <PartySave ref="partyDialog" v-model="party"/>
    </Dialog>
    <Dialog
        v-model:visible="openSettings" modal header="Settings"
        @show="dialogOpen()"
        @after-hide="dialogClosed()">
      <SettingsView/>
    </Dialog>
    <Dialog
        v-model:visible="isEditing" modal header="Edit characters" :style="{ width:'98%'}"
        @show="dialogOpen()"
        @after-hide="dialogClosed()">
      <CharEdit ref="editDialog" v-model="party.characters"/>
    </Dialog>
    <Dialog
        v-model:visible="openInfo" modal header="Info View" :style="{ width:'98%'}"
        @show="dialogOpen()"
        @after-hide="dialogClosed()">
      <InfoView/>
    </Dialog>

    <RollTable ref="rt" v-model="party.characters" :party-name="party.name"/>
    <div class="inline-block align-top w-3/12 max-h-screen overflow-scroll bg-neutral-300 dark:bg-neutral-800">
      <div class="flex flex-row-reverse border-b">
        <div class=" m-2 flex justify-between w-full">
          <div class="inline-block">
            <Button class="" @click="isEditing=true">
              <MdiIcon icon="mdiAccountEdit"/>
            </Button>
          </div>
          <div class="inline-block">
            <ToggleButton
                v-model="toggle"
                on-label="Locked" off-label="Unlocked" on-icon="dropdownicon"
                off-icon="dropdownicon"
                class="mx-1"
                @update:model-value="toggleDarkMode">
              <MdiIcon v-if="toggle" icon="mdiWeatherSunny"/>
              <MdiIcon v-if="!toggle" icon="mdiWeatherNight"/>
            </ToggleButton>
            <Button outlined class="mx-1" @click="hasPartyChanged=true">
              <MdiIcon icon="mdiAccountGroup"/>
            </Button>
            <Button outlined class="mx-1" @click="openInfo=true">
              <MdiIcon icon="mdiInformation"/>
            </Button>
            <Button outlined @click="openSettings=true">
              <MdiIcon icon="mdiCog"/>
            </Button>
          </div>
        </div>
      </div>

      <div class=" ">
        <DCPane/>
      </div>

    </div>
  </div>
</template>

