<script setup lang="ts">


import {capitalize, ref} from "vue";
import type {iCharacters} from "../ts/types";
import {Attribute, type belowBorder, type iDC, type iLore, newCharacter, proficiencyLevel} from "../ts/types";

import {type iPBChar, loadFromPB, updateCharatcer} from "../ts/pb";

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
import MainPanel from "./MainPanel.vue";
import AttributePanel from "./AttributePanel.vue";
import DefensePanel from "./DefensePanel.vue";
import RestistancePanel from "./RestistancePanel.vue";
import VulnerabiliesPanel from "./VulnerabiliesPanel.vue";
import SkillEditTable from "./SkillEditTable.vue";

const characters = defineModel<iCharacters>({required: true, default : [newCharacter(0)] });

const border = ref<belowBorder>()





const rLoading = ref<boolean>(false)



const newResistance = ref("")
const newResistanceValue = ref(0)

const newVulnerability = ref("")
const newVulnerabilityValue = ref(0)


const rHoverVal = ref<number>(-2)
const rHoverDragged = ref<number>(-2)

const selectedTab = ref<number>(0)
const pathbuilderText = ref<string>("")
const pathbuilderID = ref<string>("")

const keyAttr = ref([
  {key : Attribute.str, name : "str"},
  {key : Attribute.con, name : "con"},
  {key : Attribute.dex, name : "dex"},
  {key : Attribute.int, name : "int"},
  {key : Attribute.wis, name : "wis"},
  {key : Attribute.cha, name : "cha"},
])




function updateFromPB() {
  function updateUsingPB(i : number, Pb_json : iPBChar) {
    if(characters.value === undefined) {
      characters.value = []
      return
    }
    if(i in characters.value){
      characters.value[i] = updateCharatcer(characters.value[i] ?? newCharacter(i), Pb_json);
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
  id : number | string,
  clientWidth : number,
  parentElement? : myDragEventTarget
}




interface myDragEvent extends DragEvent{
  target : myDragEventTarget

}




function onDrag(event : DragEvent) {
  const u = event as myDragEvent

  if(u.target === null || u.dataTransfer === null)
    return


  console.info("Start Drag", u.target, u.target.id)
  rHoverDragged.value = u.target.id as number;
  u.dataTransfer.effectAllowed = 'move';
  u.dataTransfer.dropEffect = 'move';

}

function dragEnd(event : DragEvent) {
  const u = event as myDragEvent

  if(u.target === null)
    return

  console.info("Stop Drag", u.target, u.target.id, rHoverDragged.value, rHoverVal.value)
  const target = rHoverVal.value - Number(rHoverVal.value > rHoverDragged.value)

  var el = characters.value[rHoverDragged.value];
  if(el != undefined) {
    characters.value.splice(rHoverDragged.value, 1);
    characters.value.splice(target, 0, el);
  }

  rHoverVal.value = -1;
  rHoverDragged.value = -1;
}

function onDrop(event: DragEvent) {
  const u = event as myDragEvent

  if(u.dataTransfer === null)
    return

  u.dataTransfer.effectAllowed = 'move';

  var target : myDragEventTarget | undefined  = u.target;
  if (u.target.id == "icon") {
    target = target.parentElement;
  }

  if(target === undefined)
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

function addResistance(iChar: number) {
  characters.value[iChar]?.resistances.push({name: newResistance.value, value: newResistanceValue.value})
  newResistance.value = ""
  newResistanceValue.value = 0
}

function removeResistance(iChar: number, iRes: number) {
  characters.value[iChar]?.resistances.splice(iRes, 1);
}





</script>


<template>
  <Dialog v-model:visible="rLoading" modal class="z-10 w-1/2" header="Update from Pathbuilder Json">
    <span class="text-surface-500 dark:text-surface-400 block">Input the ID.</span>
    <InputText v-model="pathbuilderID"></InputText>
    <span class="text-surface-500 dark:text-surface-400 block">
              or Paste the Json data for the character.</span>
    <Textarea v-model="pathbuilderText" class="w-full"></Textarea>
    <div>Note: Following fields aren't updated: Check penalty, Item bonuses & player name</div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="rLoading = false"></Button>
      <Button type="button" label="Update" @click="rLoading = false; updateFromPB()"></Button>
    </div>
  </Dialog>


  <Tabs scrollable lazy v-model:value="selectedTab" class="overflow-clip">
    <TabList class="tabs">
      <Tab v-for="(char, i) in characters" :key="'edit_char_sel_' + i"
           :id="i"
           :value="i">
        <div class="p-2 hover" :id="String(i)" :class="{
            ['hoverL']: i == 0 && rHoverVal == 0,
            ['hoverR']: i + 1 == rHoverVal}"
             draggable="true"
             @dragend="u=>dragEnd(u)"
             @ondrop="(u : DragEvent)=>onDrop(u)"
             @dragover="u=>onDrop(u)"
             @dragstart="u=>onDrag(u)"
        >

          <mdi-icon @dragover.prevent class="inline-block" :class="{'dragged':i==rHoverDragged}" icon="mdiViewColumn"
                    id="icon"/>
          <span @dragover.prevent id="icon" class="pl-1"
                :class="{'dragged':i==rHoverDragged || char.name == ''}">{{
              char.name == '' ? 'New' : char.name
            }}</span>
        </div>
      </Tab>
      <Button outlined class="p-0 ml-2 mt-auto mb-auto" size="small" @click="addCharacter">
        <MdiIcon icon="mdiPlus"/>
      </Button>

    </TabList>

    <TabPanels class="overflow-clip">
      <TabPanel v-for="(char, i) in characters" :value="i" class="h-full overflow-clip" :key="'edit_char_' + i">
        <scroll-panel class="inline-block align-top" style=" height: 70vh; width: 35%">
          <div class="inline-block w-7/12 ">
            <MainPanel :char="char"/>
            <AttributePanel :char="char" :i="i"/>
          </div>
          <div class="inline-block align-top w-5/12">
            <Panel toggleable header="Other" class="">
              <div class="pl-2">
                <Button class="mr-2" @click="rLoading = true;">Load from<br>Pathbuilder</Button>
                <Button class="" @click="removeCharacter">Delete<br> Character</Button>

              </div>
            </Panel>
            <DefensePanel :char="char"/>
            <RestistancePanel :char="char" :i="i"/>
            <VulnerabiliesPanel :char="char" :i="i"/>
          </div>
        </scroll-panel>
        <ScrollPanel class="inline-block align-top" style=" height: 70vh; width: 65%">
          <SkillEditTable :char="char" :i="i"/>
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
