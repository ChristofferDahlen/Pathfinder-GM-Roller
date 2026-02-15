<script setup lang="ts">

import {onMounted, onUnmounted, ref, inject} from "vue";


import InputText from "primevue/inputtext";
import {type RollerShortcuts} from "../ts/settings.ts"
const emit = defineEmits<{set : [value: number]}>()
const props = defineProps({dc: Number});
const minDC = 0;
const maxDC = 60;

const displayHeader = ref(true);


onMounted(() => {
  document.addEventListener('keydown', numbShortcut)
})

onUnmounted(() => {
  document.removeEventListener('keydown', numbShortcut)
})


const shortcuts = inject<ref<RollerShortcuts>>("shortcuts")

type savedDC = {
  val: number,
  strVal: string,
  header: string
}

const saved_dcs = ref<Array<savedDC>>([
  { val: Number(0), strVal:"0", header:"Saved 1"},
  { val: Number(0), strVal:"0", header:"Saved 2"},
  { val: Number(0), strVal:"0", header:"Saved 3"},
  { val: Number(0), strVal:"0", header:"Saved 4"},
  { val: Number(0), strVal:"0", header:"Saved 5"},
  { val: Number(0), strVal:"0", header:"Saved 6"}])

function selectAll(event: FocusEvent | KeyboardEvent) {
  if (event.target != null) {
    const elem = event.target as HTMLInputElement
    elem.select();
  }
}

const checkDigit = (event : KeyboardEvent, index : number) => {
  if (event.key !== "Enter") {
    if (event.key.length === 1 && isNaN(Number(event.key)) || event.key.indexOf(' ') >= 0) {
      event.preventDefault();
    }
  } else {
    if(index in saved_dcs.value)
      update(saved_dcs.value[index] as savedDC);
    selectAll(event)
    event.preventDefault();
  }
};

function updateText(dc : savedDC) {
  dc.strVal = dc.val.toString();
}

function update(dc : savedDC) {
  var val = parseInt(dc.strVal);
  if (val < minDC)
    val = minDC;
  else if (val > maxDC)
    val = maxDC
  if (val !== dc.val) {
    dc.val = Number(val);
  }
  updateText(dc)
}

function save(dc : savedDC) {
  if(props.dc !== undefined)
    dc.val = props.dc;
  updateText(dc)
}

function load(dc : savedDC) {
  emit("set", dc.val, true);
}

function swap(dc : savedDC) {
  const tempDc = dc.val;
  if(props.dc !== undefined)
    dc.val = props.dc;
  updateText(dc)
  emit("set", tempDc);
}

function numbShortcut(key: KeyboardEvent) {
  var keyIndex: number = -1

  if(key.key == shortcuts.value.Saved1)
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

</script>

<template>
        <div v-for="(dc, i) in saved_dcs" class="saved-field inline-block p-1 align-middle content-center">
          <div class="relative">
          <InputText v-if="displayHeader" v-model="dc.header" pt:root:class="pt_header" class="header"></InputText>
          </div>
          <div class="SaveButton">
            <div class="button rounded-l" @click="save(dc)" ><span class="px-2 text">Save</span></div>
            <div class="button "><span @click="load(dc)" class="px-2 border-r border-l text">Load</span></div>
            <div class="button"><span @click="swap(dc)" class="px-2 text">Swap</span></div>
            <InputText v-model="dc.strVal"
                       pt:root:class="pt_input"
                       @keydown="e => checkDigit(e,i)"
                       @focus="selectAll"
                       @focusout="update(dc)"
                       variant="filled" size="small"  class="input rounded-l-none"></InputText>
          </div>
        </div>
</template>

<style scoped lang="scss">
@use "../assets/styles/dc/DCHead" as *;
</style>
