<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch, provide} from 'vue'

import ToggleButton from 'primevue/togglebutton';
import RollTable from "./table/RollTable.vue";
import DCPane from "./pane/DC-pane.vue"
import Dialog from "primevue/dialog";
import Button from "primevue/button";

import {newParty, type iParty, type iSkillTable} from "./ts/types.ts"
import {DEFAULT_ROLLER_SETTINGS, DEFAULT_SHORTCUTS, type RollerSettings, type RollerShortcuts} from "./ts/settings.ts";
import CharEdit from "./edit/charEdit.vue";
import PartySave from "./save/PartySave.vue";

interface IRoller {
  rollAll(): never;

  selectSkills(u: Array<keyof iSkillTable | string>): never;
}

const CHARACTERS_KEY = "characters";
const SHORTCUTS_KEY = "Shortcuts";

const toggle = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const hasPartyChanged = ref<boolean>(false);
const roller = ref<IRoller>();
const isLoading = ref(false);
const settings = ref<RollerSettings>();
const shortcuts = ref<RollerShortcuts>();
const party = ref<iParty>(newParty());
const editDialog = ref(null);
const partyDialog = ref(null);

provide("shortcuts", shortcuts);

const generateCharacterKey = (): string => {
  const arr = new Uint8Array(10);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (byte) => ('0' + byte.toString(16)).slice(-2)).join("");
};

const savePartyToLocalStorage = (): void => {
  console.log("Saving party to localStorage", party.value);
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(party.value));
};

const toggleDarkMode = (): void => {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.classList.toggle('dark', !toggle.value);
  }
};

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === " " && !isEditing.value) {
    roller.value?.rollAll();
  }
};

const loadPartyFromLocalStorage = (): void => {
  try {
    const storedParty = localStorage.getItem(CHARACTERS_KEY);
    if (storedParty) {
      party.value = JSON.parse(storedParty);
      console.log("Loaded party from storage", party.value);
    } else {
      party.value = newParty();
    }
  } catch (error) {
    console.error("Failed to load party, initializing new party...", error);
    party.value = newParty();
  }
};

const initializePartyKeys = (): void => {
  party.value.characters.forEach((character) => {
    character.key = generateCharacterKey();
    character.name = character.name ?? "";
  });
};

const loadShortcutsFromLocalStorage = (): void => {
  try {
    const storedShortcuts = localStorage.getItem(SHORTCUTS_KEY);
    shortcuts.value = storedShortcuts ? JSON.parse(storedShortcuts) :  DEFAULT_SHORTCUTS;
  } catch (error) {
    console.error("Failed to load shortcuts, using defaults...", error);
    shortcuts.value = DEFAULT_SHORTCUTS;
  }
};

const edit = (): void => {
  isEditing.value = true;
};

const roll = (): void => {
  roller.value?.rollAll();
};

const selectSkills = (skills: Array<keyof iSkillTable | string>): void => {
  roller.value?.selectSkills(skills);
};

watch(party, savePartyToLocalStorage);

onMounted(() => {
  loadPartyFromLocalStorage();
  initializePartyKeys();
  loadShortcutsFromLocalStorage();
  document.addEventListener("keydown", handleKeyDown);
  isLoading.value = false;
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template class="dark-mode">

  <div v-if="isLoading" class="background w-full h-full text-center">LOADING </div>
  <div v-else class="background w-full">

    <Dialog v-model:visible="hasPartyChanged" modal header="Save / Load Party" :style="{ width:'98%'}" @after-hide="savePartyToLocalStorage(); roll();">
      <PartySave ref="partyDialog" v-model="party"></PartySave>
    </Dialog>
    <Dialog v-model:visible="isEditing" modal header="Edit characters" :style="{ width:'98%'}" @after-hide="savePartyToLocalStorage(); roll();">
      <char-edit ref="editDialog" v-model="party.characters"></char-edit>
    </Dialog>



    <RollTable v-model="party.characters" @edit="edit" ref="rt" :settings="settings" :partyName="party.name"></RollTable>
    <div class="inline-block align-top w-3/12 max-h-screen overflow-scroll">
      <div class="flex flex-row-reverse border-b">
        <div class=" m-2 flex justify-between w-full">
          <div class="inline-block">
            <Button  class="" @click="isEditing=true">
              <MdiIcon icon="mdiAccountEdit" ></MdiIcon>
            </Button>
          </div>
          <div class="inline-block">
            <ToggleButton v-model="toggle"
                          onLabel="Locked" offLabel="Unlocked" onIcon="dropdownicon"
                          offIcon="dropdownicon"
                          @click="toggleDarkMode()"
                          class="mx-1">
              <MdiIcon v-if="toggle" icon="mdiWeatherSunny"/>
              <MdiIcon v-if="!toggle" icon="mdiWeatherNight"/>
            </ToggleButton>
            <Button outlined class="mx-1" @click="hasPartyChanged=true">
              <MdiIcon icon="mdiAccountGroup" ></MdiIcon>
            </Button>
            <Button outlined class="mx-1">
              <MdiIcon icon="mdiInformation" ></MdiIcon>
            </Button>
            <Button outlined>
              <MdiIcon icon="mdiCog" ></MdiIcon>
            </Button>
          </div>
        </div>
      </div>

      <div class=" " >
        <DCPane @roll="roll"></DCPane>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
</style>


<script>

</script>
