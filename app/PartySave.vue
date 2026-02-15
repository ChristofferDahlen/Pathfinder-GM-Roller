<script setup lang="ts">

import {capitalize, onMounted, onUnmounted, ref} from "vue";
import type {iParty} from "ts/types";
import ScrollPanel from "primevue/scrollpanel";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";


const allParties = ref<Array<iParty>>([]);

const currentParty = defineModel<iParty>({default : {name: "Gorbans Destoryers", characters: []}, required: true});

function getSavedIndex() {
  for(const ip in allParties.value) {
    const party = allParties.value[ip];
    if(currentParty.value !== undefined && party?.name == currentParty.value.name)
      return ip;
  }
  return -1;
}

function sortParties() {
  allParties.value.sort((a : iParty, b : iParty) => capitalize(a.name) > capitalize(b.name) ? -1 : 1)
}


function save() {
  console.info("Saving Party:", currentParty.value?.name)
  const lcopy = JSON.parse(JSON.stringify(currentParty.value));
  const i = +getSavedIndex()
  if(i < 0){
    allParties.value?.push(lcopy)
  } else {
    allParties.value[i] = lcopy
  }
  console.log(allParties.value)
  sortParties()
  localStorage.setItem("saved_parties", JSON.stringify(allParties.value));
  console.log(localStorage.getItem("saved_parties"))

}

onMounted(() => {
  console.info("Loading saved parties from cache")

  try{
    const loading_parites =localStorage.getItem("saved_parties");
    if(loading_parites !== null)
      allParties.value =JSON.parse(loading_parites) as Array<iParty>;
  }
  catch (e) {
    console.error(e);
    allParties.value = []
  }
})
onUnmounted(() => {
  localStorage.setItem("saved_parties", JSON.stringify(allParties.value));

})

function loadParty(party : iParty) {
  currentParty.value = party;
  sortParties()
}

function deleteParty(index : number) {
  console.log("Delete", index)
  try {
    allParties.value.splice(index, 1);
  sortParties()
  } catch {
    allParties.value=[]
  }

}


</script>

<template>
  <Panel header="Saved Parties" class="inline-block align-top mr-1" style="width: 79%">
    <ScrollPanel class="" style="height: 60vh">

    <div class="grid" style="grid-template-columns: 20% auto 10rem">
        <div class="grid__item text-center">Saved Parties</div>
        <div class="grid__item text-center">Members</div>
        <div class="grid__item text-center"></div>

      <template v-for="(party,i) in allParties" :key="i">
        <div class="grid__item text-center">
            {{party.name}}

         </div>
        <div class="grid__item text-center">
          <div class="charBorder " v-for="char in party.characters" :key="char.name">
            <div>
              <div>{{char.name}}</div>
              <div class="text-center text-xs"> {{char.class}} {{char.level}}</div>
            </div>
          </div>
        </div>
        <div class=" grid__item text-center">
          <Button @click="loadParty(party)" class="inline m-1">Load</Button>
          <Button @click="deleteParty(i)" class="inline m-1">Delete</Button>
        </div>
      </template>
    </div>
    </ScrollPanel>
  </Panel>

  <div class="w-1/5 inline-block">
  <Panel header="Current Party" class="mb-1">

  <div class="inline-block h-full">
    <label for="partyName" class="m-2">Party Name</label>

    <InputText v-model="currentParty.name" id="partyName" class="w-full" aria-describedby="Party Name" placeholder="Party Name"></InputText>
    <scroll-panel class="mb-auto" style="height: 30vh; width: 100%">
      <div>
        <div>
          <div class="charBorder" v-for="char in currentParty.characters" :key="char.name">
            <div>
              <div>{{char.name}}</div>
              <div class="charSubText"> {{char.class}} {{char.level}}</div>
            </div>
          </div>
        </div>
      </div>
    </scroll-panel>
    <div class="w-fit ml-auto my-auto">
      <Button @click="save" class="inline m-1">Save</Button>
    </div>

    <div class="w-fit mt-auto ml-auto my-auto">
    </div>

  </div>
  </Panel>
  <Panel header="Backup Json" class="">
    <div class="w-full text-center ">
      <Button class="m-1 ml-auto">Save</Button>
      <Button class="m-1 mr-auto">Load</Button>
    </div>

  </Panel>
  </div>
</template>

<style scoped lang="scss">


.grid {

  // Locally scoped variables
  --gap: 1rem;
  --line-offset: calc(var(--gap) / 2);
  --line-thickness: 1px;
  --line-color: var(--surface-border);

  // Grid layout (Can be anything)
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: hidden;
  gap: var(--gap);
}

// Make Grid Items Control Absolute Pseudo Positioning
.grid__item {
  position: relative;
}

// Pseudo Element Shared Styling
.grid__item::before,
.grid__item::after {
  content: '';
  position: absolute;
  @apply bg-gray-600;
  z-index: 1;
}

// Row Borders
.grid__item::after {
  inline-size: 100vw;
  block-size: var(--line-thickness);
  inset-inline-start: 0;
  inset-block-start: calc(var(--line-offset) * -1);
}

// Column Borders
.grid__item::before {
  inline-size: var(--line-thickness);
  inset-inline-start: calc(var(--line-offset) * -1);
}

.charBorder{
  display: inline-flex;
  padding: 0.5rem;
  margin: 2pt;
  @apply border-surface-600;
  border-width: 1pt;
  border-radius: 10pt;


  .charSubText {
    text-align: center;
    font-size: x-small;
  }

}
</style>
