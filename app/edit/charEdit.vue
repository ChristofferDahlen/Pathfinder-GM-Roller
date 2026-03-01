<script setup lang="ts">


import {ref} from "vue";
import {type iCharacters, newCharacter} from "../ts/types";


import {type iPBChar, loadFromPB, updateCharacter} from "../ts/pb";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import InputText from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Panel from 'primevue/panel';
import MainPanel from "./Panels/MainPanel.vue";
import AttributePanel from "./Panels/AttributePanel.vue";
import DefensePanel from "./Panels/DefensePanel.vue";
import RestistancePanel from "./Panels/RestistancePanel.vue";
import VulnerabiliesPanel from "./Panels/VulnerabiliesPanel.vue";
import SkillEditTable from "./Panels/SkillEditTable.vue";
import LanguagePannel from "./Panels/LanguagePanel.vue";

const characters = defineModel<iCharacters>({required: true, default: [newCharacter(0)]});


const rLoading = ref<boolean>(false)


const rHoverVal = ref<number>(-2)
const rHoverDragged = ref<number>(-2)

const selectedTab = ref<number>(0)
const pathbuilderText = ref<string>("")
const pathbuilderID = ref<string>("")


function updateFromPB() {
  function updateUsingPB(i: number, Pb_json: iPBChar) {
    if (characters.value === undefined) {
      characters.value = []
      return
    }
    if (i in characters.value) {
      characters.value[i] = updateCharacter(characters.value[i] ?? newCharacter(i), Pb_json);
    }
  }


  const i = selectedTab.value;

  let Pb_json = null;
  if (pathbuilderID.value !== "") {
    const Pb = loadFromPB(pathbuilderID.value);
    Pb.then((Pb_json) => {
      updateUsingPB(i, Pb_json)
    })
  } else {
    const Pb_text = pathbuilderText.value
    Pb_json = JSON.parse(Pb_text)

    updateUsingPB(i, Pb_json)
  }
}


function addCharacter() {
  characters.value.push(newCharacter(characters.value.length))
  selectedTab.value = characters.value.length - 1;
}

function removeCharacter() {

  console.log("Deleting char")
  characters.value.splice(selectedTab.value, 1);
  if (selectedTab.value > 0) {
    selectedTab.value--;
  }

  if (characters.value.length == 0)
    addCharacter();
}


interface myDragEventTarget extends EventTarget {
  id: number | string,
  clientWidth: number,
  parentElement?: myDragEventTarget
}


interface myDragEvent extends DragEvent {
  target: myDragEventTarget

}


function onDrag(event: DragEvent) {
  const u = event as myDragEvent

  if (u.target === null || u.dataTransfer === null)
    return


  console.info("Start Drag", u.target, u.target.id)
  rHoverDragged.value = u.target.id as number;
  u.dataTransfer.effectAllowed = 'move';
  u.dataTransfer.dropEffect = 'move';

}

function dragEnd(event: DragEvent) {
  const u = event as myDragEvent

  if (u.target === null)
    return

  console.info("Stop Drag", u.target, u.target.id, rHoverDragged.value, rHoverVal.value)
  const target = rHoverVal.value - Number(rHoverVal.value > rHoverDragged.value)

  const el = characters.value[rHoverDragged.value];
  if (el != undefined) {
    characters.value.splice(rHoverDragged.value, 1);
    characters.value.splice(target, 0, el);
  }

  rHoverVal.value = -1;
  rHoverDragged.value = -1;
}

function onDrop(event: DragEvent) {
  const u = event as myDragEvent

  if (u.dataTransfer === null)
    return

  u.dataTransfer.effectAllowed = 'move';

  let target: myDragEventTarget | undefined = u.target;
  if (u.target.id == "icon") {
    target = target.parentElement;
  }

  if (target === undefined)
    return

  const center = target.clientWidth / 2;
  const left = u.layerX < center;
  const id = Number(target.id);

  if (left) {
    rHoverVal.value = id;
  } else {
    rHoverVal.value = id + 1;
  }
}


</script>


<template>
  <Dialog v-model:visible="rLoading" modal class="z-10 w-1/2" header="Update from Pathbuilder Json">
    <span class="text-surface-500 dark:text-surface-400 block">Input the ID.</span>
    <InputText v-model="pathbuilderID"/>
    <span class="text-surface-500 dark:text-surface-400 block">
              or Paste the Json data for the character.</span>
    <Textarea v-model="pathbuilderText" class="w-full"/>
    <div>Note: Following fields aren't updated: Check penalty, Item bonuses & player name</div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="rLoading = false"/>
      <Button type="button" label="Update" @click="rLoading = false; updateFromPB()"/>
    </div>
  </Dialog>


  <Tabs v-model:value="selectedTab" scrollable lazy class="overflow-clip">
    <TabList class="tabs">
      <Tab
          v-for="(char, i) in characters" :id="i"
          :key="'edit_char_sel_' + i"
          :value="i">
        <div
            :id="String(i)" class="p-2 hover" :class="{
            ['hoverL']: i == 0 && rHoverVal == 0,
            ['hoverR']: i + 1 == rHoverVal}"
            draggable="true"
            @dragend="u=>dragEnd(u)"
            @ondrop="(u : DragEvent)=>onDrop(u)"
            @dragover="u=>onDrop(u)"
            @dragstart="u=>onDrag(u)"
        >

          <mdi-icon
              id="icon" class="inline-block" :class="{'dragged':i==rHoverDragged}" icon="mdiViewColumn"
              @dragover.prevent/>
          <span
              id="icon" class="pl-1" :class="{'dragged':i==rHoverDragged || char.name == ''}"
              @dragover.prevent>{{
              char.name == '' ? 'New' : char.name
            }}</span>
        </div>
      </Tab>
      <Button outlined class="p-0 ml-2 mt-auto mb-auto" size="small" @click="addCharacter">
        <MdiIcon icon="mdiPlus"/>
      </Button>

    </TabList>

    <TabPanels class="overflow-clip">
      <TabPanel v-for="(_, i) in characters" :key="'edit_char_' + i" :value="i" class="h-full overflow-clip">
        <scroll-panel class="inline-block align-top" style=" height: 70vh; width: 35%">
          <div class="inline-block w-7/12 ">
            <MainPanel v-model="characters[i]"/>
            <AttributePanel v-model="characters[i]"/>
          </div>
          <div class="inline-block align-top w-5/12">
            <Panel toggleable header="Other" class="">
              <div class="pl-2">
                <Button class="mr-2" @click="rLoading = true;">Load from<br>Pathbuilder</Button>
                <Button class="" @click="removeCharacter">Delete<br> Character</Button>
              </div>
            </Panel>
            <DefensePanel v-model="characters[i]"/>
            <RestistancePanel v-model="characters[i]"/>
            <VulnerabiliesPanel v-model="characters[i]"/>
            <LanguagePannel v-model="characters[i]"/>

          </div>
        </scroll-panel>
        <ScrollPanel class="inline-block align-top" style=" height: 70vh; width: 65%">
          <SkillEditTable v-model="characters[i]"/>
        </ScrollPanel>
      </TabPanel>
    </TabPanels>

  </Tabs>

</template>

<style scoped lang="scss">

.tabs {
  .p-tab {
    margin: 0;
    padding: 0;
  }

  .hoverL {
    @apply border-l-2;
    @apply border-double;
    @apply border-surface-700;
  }

  .hoverR {
    @apply border-r-2;
    @apply border-double;
    @apply border-surface-700;
  }


  .dragged {
    @apply opacity-20;
  }
}

.pt_rv_text {
  font-size: small;
  @apply align-middle;

  padding: 0;
}


.table_total {

}

</style>
