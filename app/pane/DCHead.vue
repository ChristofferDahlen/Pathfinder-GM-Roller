<script setup lang="ts">
import {ref, watch} from "vue";

import InputText from "primevue/inputtext";
import Button from "primevue/button";

import {DC} from "../ts/sharedResources"
import {onShortcutKey, shortcutsEnum} from "../ts/settings"

onShortcutKey([shortcutsEnum.dcUp],    () => DC.add(1, false));
onShortcutKey([shortcutsEnum.dcDown],  () => DC.add(-1, false));
onShortcutKey([shortcutsEnum.dcUp5],   () => DC.add(5, false));
onShortcutKey([shortcutsEnum.dcDown5], () => DC.add(-5, false));

const dcText = ref(DC.value.toString())
const dcScrollVal = ref(DC.value)

function updateViaTextBox() {
  DC.set(parseInt(dcText.value), false, true);
  dcScrollVal.value = DC.value;
}

watch(DC, newValue => {
  dcText.value = newValue.value.toString()
  dcScrollVal.value = newValue.value
})

function slideChange() {
  dcText.value = dcScrollVal.value.toString()
}

function slideEnd() {
  DC.set(dcScrollVal.value, false, false)
}


function selectAll(event: FocusEvent | KeyboardEvent) {
  if (event.target != null) {
    const elem = event.target as HTMLInputElement
    elem.select();
  }
}


const checkDigit = (event: KeyboardEvent) => {
  if (event.key !== "Enter") {
    if (event.key.length === 1 && isNaN(Number(event.key)) || event.key.indexOf(' ') >= 0) {
      event.preventDefault();
    }
  }
  if (event.key === "Enter")
    updateViaTextBox()
};




</script>

<template>
  <div class="content-center p-2">
    <div class="flex">
      <div class="grid gap-1 w-1/3 ">
        <Button
            class="diff-button left" outlined color="primary" variant="outlined"
            @click="DC.add(-5, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-5</div>
            <div class="dc-button-disc">Very easy</div>
          </div>
        </Button>
        <Button
            class="diff-button left" outlined color="primary" variant="outlined"
            @click="DC.add(-2, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-2</div>
            <div class="dc-button-disc">Easy</div>
          </div>
        </Button>
        <Button
            class="diff-button left" outlined style="grid-area: 2 / 1 / 2  / 3 " color="primary"
            variant="outlined"
            @click="DC.add(-10, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-10</div>
            <div class="dc-button-disc">Incredibly easy</div>
          </div>
        </Button>
      </div>
      <div class="flex w-fit flex-col m-auto">
        <header class="DC_header m-auto">
          DC
        </header>
        <InputText
            ref="input"
            v-model="dcText"
            color="primary"
            class="DC_input m-auto"
            type="number"
            @change="updateViaTextBox"
            @keydown="checkDigit"
            @focus="selectAll"
            @focusout="updateViaTextBox"/>
        <Button
            class="text-xs w-fit m-auto align-middle" :class="{invisible : DC.resetValue === undefined}" outlined
            @click="DC.setReset()">
          Reset
          <div v-if="DC.resetValue !== undefined" class="text-xs">({{ DC.resetValue }})</div>
        </Button>

      </div>
      <div class="grid gap-1 w-1/3">
        <Button class="diff-button left" outlined @click="DC.add(2, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">+2</div>
            <div class="dc-button-disc">Hard</div>
          </div>
        </Button>
        <Button class="diff-button left" outlined @click="DC.add(5, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">+5</div>
            <div class="dc-button-disc">Very Hard</div>
          </div>
        </Button>
        <Button
            class="diff-button left" style="grid-area: 2 / 1 / 2  / 3 " outlined
            @click="DC.add(10, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">+10</div>
            <div class="dc-button-disc">Incredibly Hard</div>
          </div>
        </Button>
      </div>

    </div>
      <Slider v-model="dcScrollVal" class="align-middle pt-2 m-2" :min="0" :max="60" @change="slideChange" @slideend="slideEnd"/>



  </div>

</template>

<style scoped lang="scss">
@use "../assets/styles/dc/DCHead" as *;
</style>
