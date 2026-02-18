<script setup lang="ts">
import {useMagicKeys,} from "@vueuse/core";

import {onMounted, onUnmounted, ref} from "vue";
import {DC} from "../../ts/sharedResources"

import InputText from "primevue/inputtext";
import {magicKeys, onShortcutKey, RollerShortcuts, shortcutsEnum} from "../../ts/settings.ts"

const minDC = 0;
const maxDC = 60;

const displayHeader = ref(true);


type savedDC = {
  val: number,
  strVal: string,
  header: string
}


const saved_dcs = ref<Array<savedDC>>([
  {val: Number(15), strVal: "15", header: "Saved 1"},
  {val: Number(15), strVal: "15", header: "Saved 2"},
  {val: Number(15), strVal: "15", header: "Saved 3"},
  {val: Number(15), strVal: "15", header: "Saved 4"},
  {val: Number(15), strVal: "15", header: "Saved 5"},
  {val: Number(15), strVal: "15", header: "Saved 6"}])

function setDefaultSaved() {
  saved_dcs.value = [
    {val: Number(15), strVal: "15", header: "Saved 1"},
    {val: Number(15), strVal: "15", header: "Saved 2"},
    {val: Number(15), strVal: "15", header: "Saved 3"},
    {val: Number(15), strVal: "15", header: "Saved 4"},
    {val: Number(15), strVal: "15", header: "Saved 5"},
    {val: Number(15), strVal: "15", header: "Saved 6"}]
}

function selectAll(event: FocusEvent | KeyboardEvent) {
  if (event.target != null) {
    const elem = event.target as HTMLInputElement
    elem.select();
  }
}

const checkDigit = (event: KeyboardEvent, index: number) => {
  if (event.key !== "Enter") {
    if (event.key.length === 1 && isNaN(Number(event.key)) || event.key.indexOf(' ') >= 0) {
      event.preventDefault();
    }
  } else {
    if (index in saved_dcs.value)
      update(saved_dcs.value[index] as savedDC);
    selectAll(event)
    event.preventDefault();
  }
};

function updateText(dc: savedDC) {
  dc.strVal = dc.val.toString();
  SaveToStorage()
}

function update(dc: savedDC) {
  console.log("Update saved DC", dc)
  let val = parseInt(dc.strVal);
  if (val < minDC)
    val = minDC;
  else if (val > maxDC)
    val = maxDC
  if (val !== dc.val) {
    dc.val = Number(val);
  }
  updateText(dc)
}

function save(i: number) {
  const dc = saved_dcs.value[i]
  console.log("Save to DC", dc.val)
  dc.val = DC.value;
  updateText(dc)
}

function set(i: number) {
  const dc = saved_dcs.value[i]
  DC.set(dc.val, true)
}

function swap(i: number) {
  const dc = saved_dcs.value[i]
  console.log("Swap DC", dc.val, DC.value)
  const tempDc = DC.value;
  DC.set(dc.val)
  dc.val = tempDc
  updateText(dc)
}


onMounted(() => {
  try {
    const dcs = localStorage.getItem("savedDCs")
    console.log("Loading Saved DCs", dcs);
    //const stored_characters = null;
    if (dcs !== null) {
      const sDCs: Array<savedDC> = JSON.parse(dcs)
      console.log("Tes")
      saved_dcs.value = sDCs
    } else {
      console.log("Failure")
      setDefaultSaved()
    }
  } catch (e) {
    console.error(e)
    console.log("Failure 2 ")
    setDefaultSaved()
  }
})

function SaveToStorage() {
  localStorage.setItem("savedDCs", JSON.stringify(saved_dcs.value))

}

onUnmounted(() => {
  localStorage.setItem("savedDCs", JSON.stringify(saved_dcs.value))
})

const setKeys = {
  [shortcutsEnum.setSlot1]: 0,
  [shortcutsEnum.setSlot2]: 1,
  [shortcutsEnum.setSlot3]: 2,
  [shortcutsEnum.setSlot4]: 3,
  [shortcutsEnum.setSlot5]: 4,
  [shortcutsEnum.setSlot6]: 5,
}


onShortcutKey([shortcutsEnum.setSlot1,
      shortcutsEnum.setSlot2,
      shortcutsEnum.setSlot3,
      shortcutsEnum.setSlot4,
      shortcutsEnum.setSlot5,
      shortcutsEnum.setSlot6
    ],
    (k) => {
      set(setKeys[k]);
    }
)


const swapKeys = {
  [shortcutsEnum.swapSlot1]: 0,
  [shortcutsEnum.swapSlot2]: 1,
  [shortcutsEnum.swapSlot3]: 2,
  [shortcutsEnum.swapSlot4]: 3,
  [shortcutsEnum.swapSlot5]: 4,
  [shortcutsEnum.swapSlot6]: 5,
}


onShortcutKey([
      shortcutsEnum.swapSlot1,
      shortcutsEnum.swapSlot2,
      shortcutsEnum.swapSlot3,
      shortcutsEnum.swapSlot4,
      shortcutsEnum.swapSlot5,
      shortcutsEnum.swapSlot6
    ],
    (k) => {
      swap(swapKeys[k]);
    }
)


</script>

<template>
  <div>
    <div v-for="(dc, i) in saved_dcs" :key="i" class="saved-field inline-block p-1 align-middle content-center">
      <div class="relative">
        <InputText
            v-if="displayHeader" v-model="dc.header" pt:root:class="pt_header" class="header"
            @focusout="SaveToStorage"/>
      </div>
      <div class="SaveButton">
        <div class="button rounded-l" @click="save(i)"><span class="px-2 text">Save</span></div>
        <div class="button "><span class="px-2 border-r border-l text" @click="set(i)">Set</span></div>
        <div class="button"><span class="px-2 text" @click="swap(i)">Swap</span></div>
        <InputText
            v-model="dc.strVal"
            pt:root:class="pt_input"
            variant="filled"
            size="small"
            class="input rounded-l-none"
            @keydown="e => checkDigit(e,i)" @focus="selectAll" @focusout="update(dc)"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/styles/dc/DCHead" as *;
</style>
