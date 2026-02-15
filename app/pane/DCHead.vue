<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";

import InputText from "primevue/inputtext";
import Button from "primevue/button";

import {DC} from "../ts/sharedResources"


const dcText = ref("15")
const dcScrollVal = ref(15)


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
  if(event.key === "Enter")
    updateViaTextBox()
};



function setOldDcShortcut(key: KeyboardEvent) {
  console.log(key.key, "oldDC", shortcuts.value.Reset)
  if(key.key === shortcuts.value.Reset)
    DC.reset()
}



onMounted(() => {
  document.addEventListener('keydown', setOldDcShortcut)
})

onUnmounted(() => {
  document.removeEventListener('keydown', setOldDcShortcut)
})

</script>

<template>
  <div class="content-center p-2">
    <div class="flex">
      <div class="grid gap-1 w-1/3 ">
        <Button class="diff-button left" outlined color="primary" variant="outlined"
                @click="DC.add(-5, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-5</div>
            <div class="dc-button-disc">Very easy</div>
          </div>
        </Button>
        <Button class="diff-button left" outlined color="primary" variant="outlined"
                @click="DC.add(-2, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-2</div>
            <div class="dc-button-disc">Easy</div>
          </div>
        </Button>
        <Button class="diff-button left" outlined style="grid-area: 2 / 1 / 2  / 3 " color="primary"
                variant="outlined"
                @click="DC.add(-10, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">-10</div>
            <div class="dc-button-disc">Incredibly easy</div>
          </div>
        </Button>
      </div>
      <div class="inline-block grid w-fit m-auto">
          <header class="DC_header m-auto">
            DC
          </header>
          <InputText color="primary" v-model="dcText"
                     class="DC_input"
                     type="number"
                     ref="input"
                     @change="updateViaTextBox"
                     @keydown="checkDigit"
                     @focus="selectAll"
                     @focusout="updateViaTextBox">

          </InputText>
        <Button class="text-xs w-fit m-auto" :class="{invisible : DC.resetValue === undefined}" outlined @click="DC.reset()" >
          Reset <div class="text-xs" v-if="DC.resetValue !== undefined">({{DC.resetValue}})</div>
        </Button>
      </div>
      <div class="grid gap-1 w-1/3 inline-block">
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
        <Button class="diff-button left" style="grid-area: 2 / 1 / 2  / 3 " outlined
                @click="DC.add(10, false)">
          <div class="text-center m-auto">
            <div class=" dc-button-text">+10</div>
            <div class="dc-button-disc">Incredibly Hard</div>
          </div>
        </Button>
      </div>

    </div>
    <Slider v-model="dcScrollVal" @change="slideChange" @slideend="slideEnd" :min="0" :max="60"/>



  </div>

</template>

<style scoped lang="scss">
@use "../assets/styles/dc/DCHead" as *;
</style>
