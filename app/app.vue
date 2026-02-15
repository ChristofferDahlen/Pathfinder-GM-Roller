<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch, provide} from 'vue'

import ToggleButton from 'primevue/togglebutton';
import RollTable from "./RollTable.vue";
import DCPane from "./DC-pane.vue"
import Dialog from "primevue/dialog";
import Button from "primevue/button";

import {newParty, type iParty, type iSkillTable} from "./ts/types.ts"
import {defaultShortcuts, type RollerSettings, type RollerShortcuts} from "./ts/settings.ts";
import CharEdit from "./edit/charEdit.vue";
import {DC} from "./ts/sharedResources";
import PartySave from "./PartySave.vue";


interface iRoller {
  rollAll() : never,
  selectSkills(u : Array<keyof iSkillTable | string>) : never
}


const toggle = ref<boolean>(false)
const editing = ref<boolean>(false)
const partyChange = ref<boolean>(false)

const rt = ref<iRoller>();

const loading = ref(false);

const settings = ref<RollerSettings>();
const shortcuts = ref<RollerShortcuts>();

provide("shortcuts", shortcuts )

const party = ref<iParty>(newParty())

const editDialog = ref(null);

const partyDialog = ref(null);

function byteToHex(byte:number) {
  return ('0' + byte.toString(16)).slice(-2);
}

function generateKey() {
  var arr = new Uint8Array(10);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, byteToHex).join("");
}

function roll(){
  rt.value?.rollAll()
}


function keydown(key : KeyboardEvent) {
  if (key.key === " " && !editing.value) {
    rt.value?.rollAll()
  }}



function Save() {
  console.log("Save", party.value);

  localStorage.setItem("characters", JSON.stringify(party.value))
}

function toggleDarkMode() {
  const element = document.querySelector('html');
  if(element !== null)
    element.classList.toggle('dark', !toggle.value)
}

watch(party, (newChars) => {
  Save()
})

function edit() {
  editing.value = true;
}


onMounted(() => {
      try {
        const stored_characters = localStorage.getItem("characters")
        //const stored_characters = null;
        if (stored_characters !== null) {
          const lparty : iParty = JSON.parse(stored_characters)
          console.log("Loading stored", party.value);
          party.value= lparty
        } else {
          party.value = newParty();
        }
      } catch (e) {
        console.error(e)
        party.value = newParty();
      }
      //party.value = newParty();

      party.value.characters.forEach((char) => {
            char.key = generateKey();
            char.name = char.name ?? "";
          }
      )

      try {
        const stored_shortcuts = localStorage.getItem("Shortcuts")
        if(stored_shortcuts !== null) {
          shortcuts.value = JSON.parse(stored_shortcuts)
        } else {
          shortcuts.value = defaultShortcuts();
        }
      } catch (e)
      {
        console.error(e)
        shortcuts.value = defaultShortcuts()
      }

      document.addEventListener('keydown', keydown)
      loading.value = false;
    }
)

onUnmounted(() => {
  document.removeEventListener('keydown', keydown)
})

function select(u : Array<keyof iSkillTable | string>) {
  rt.value?.selectSkills(u);
}

</script>

<template class="dark-mode">

  <div v-if="loading" class="background w-full h-full text-center">LOADING </div>
  <div v-else class="background w-full">

    <Dialog v-model:visible="partyChange" modal header="Save / Load Party" :style="{ width:'98%'}" @after-hide="Save(); roll();">
      <PartySave ref="partyDialog" v-model="party"></PartySave>
    </Dialog>
    <Dialog v-model:visible="editing" modal header="Edit characters" :style="{ width:'98%'}" @after-hide="Save(); roll();">
      <char-edit ref="editDialog" v-model="party.characters"></char-edit>
    </Dialog>



    <RollTable v-model="party.characters" @edit="edit" ref="rt" :settings="settings" :DC="DC" :partyName="party.name"></RollTable>
    <div class="inline-block align-top w-3/12 max-h-screen overflow-scroll">
      <div class="flex flex-row-reverse border-b">
        <div class="m-2">
          <ToggleButton v-model="toggle"
                        onLabel="Locked" offLabel="Unlocked" onIcon="dropdownicon"
                        offIcon="dropdownicon"
                        @click="toggleDarkMode()"
                        class="mx-1">
            <MdiIcon v-if="toggle" icon="mdiWeatherSunny"/>
            <MdiIcon v-if="!toggle" icon="mdiWeatherNight"/>
          </ToggleButton>
          <Button outlined class="mx-1" @click="partyChange=true">
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

      <div class=" " @response="(dc : number) => updateVal(dc)">
        <DCPane @newDC="updateVal" @skillSelect="u => select(u)"></DCPane>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
</style>


<script>

</script>
