<script setup lang="ts">

import {onMounted, onUnmounted, ref, watch} from 'vue';
import {newParty, type iParty} from "./ts/types.ts";
import {
  BasicSettings, BasicShortcuts,
  disableShortcuts,
  enableShortcuts,
  OrganizedSettings,
   RollerShortcuts,
} from "./ts/settings.ts";
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
const openSettings = ref(true)
const hasPartyChanged = ref(false);

const roller = ref<IRoller>();
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

function toggleCssClass(selector: string, className: string, condition: boolean): void {
  const element = document.querySelector(selector);
  if (element) element.classList.toggle(className, condition);
}


function toggleDarkMode(): void {
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
  roller.value?.rollAll();
}


watch(party, () => {
  saveToLocalStorage(CHARACTERS_KEY, party.value)
});



onMounted(() => {
  party.value = loadFromLocalStorage(CHARACTERS_KEY, newParty);
  RollerShortcuts.value = loadFromLocalStorage(SHORTCUTS_KEY, BasicShortcuts);
  OrganizedSettings.value = loadFromLocalStorage(SETTINGS_KEY, BasicSettings);

  initializePartyKeys();

  isLoading.value = false;
});

onUnmounted(() => {
  isLoading.value = true
});
</script>

<template class="dark-mode">

  <ConfirmDialog></ConfirmDialog>
  <div v-if="isLoading" class="background w-full h-full text-center">LOADING</div>
  <div v-else class="background w-full">

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
    <div class="inline-block align-top w-3/12 max-h-screen overflow-scroll">
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
                @click="toggleDarkMode()">
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

<script>

</script>


