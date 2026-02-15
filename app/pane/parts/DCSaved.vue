<script setup lang="ts">

import {onMounted, onUnmounted, ref, inject} from "vue";
import {DC} from "../../ts/sharedResources"

import InputText from "primevue/inputtext";
import type {RollerShortcuts} from "../../ts/settings.ts"

const minDC = 0;
const maxDC = 60;

const displayHeader = ref(true);

/*

onMounted(() => {
  document.addEventListener('keydown', numbShortcut)
})

onUnmounted(() => {
  document.removeEventListener('keydown', numbShortcut)
})

 */


const shortcuts = inject<ref<RollerShortcuts>>("shortcuts")

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

function save(dc: savedDC) {
  console.log("Save to DC", dc.val)
  dc.val = DC.value;
  updateText(dc)
}

function set(dc: savedDC) {
  DC.set(dc.val, true)

}

function swap(dc: savedDC) {
  console.log("Swap DC", dc.val, DC.value)
  const tempDc = DC.value;
  DC.set(dc.val)
  dc.val = tempDc
  updateText(dc)
}

/*
function numbShortcut(key: KeyboardEvent) {
  var keyIndex: number = -1

  if(key.key == shortcuts.value.)
    keyIndex = 0
  else if(key.key == shortcuts.value.Saved2)
    keyIndex = 1
  else if(key.key == shortcuts.value.Saved3)
    keyIndex = 2
  else if(key.key == shortcuts.value.Saved4)
    keyIndex = 3
  else if(key.key == shortcuts.value.Saved5)
    keyIndex = 4
  else if(key.key == shortcuts.value.Saved6)
    keyIndex = 5

  if(keyIndex > 0)
    load(saved_dcs.value[keyIndex] as savedDC)
}
 */

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
        <div class="button rounded-l" @click="save(dc)"><span class="px-2 text">Save</span></div>
        <div class="button "><span class="px-2 border-r border-l text" @click="set(dc)">Set</span></div>
        <div class="button"><span class="px-2 text" @click="swap(dc)">Swap</span></div>
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
