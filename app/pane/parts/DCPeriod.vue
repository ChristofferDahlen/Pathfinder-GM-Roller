<script setup lang="ts">

import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import {ref, onMounted, onUnmounted, watch, computed} from "vue";
import {Roller} from "../../ts/sharedResources";


const isRolling = ref(false);
const rollSec = ref(0)
const rollMins = ref(5)
const timeout = ref()


onMounted(()=> {
  const autoRoll = localStorage.getItem("auto-roll");
  const autoRollSec = localStorage.getItem("auto-roll-sec");
  const autoRollMin = localStorage.getItem("auto-roll-min");

  if(autoRollSec != null)
    rollSec.value = Number(autoRollSec);
  if(autoRollMin != null)
    rollMins.value = Number(autoRollMin);
  if(autoRoll != null)
    isRolling.value = Boolean(autoRoll);

  if(isRolling.value)
    timeout.value = setTimeout(roll, getTime())
})

function save() {
  localStorage.setItem("auto-roll", isRolling.value.toString());
  localStorage.setItem("auto-roll-sec", rollSec.value.toString());
  localStorage.setItem("auto-roll-min", rollMins.value.toString());
}

onUnmounted(() => {
})

function getTime() {
  return Math.max(1000 * rollSec.value + 60000 * rollMins.value, 1000)
}

function roll() {
  if(isRolling.value) {
    const time = getTime();
    timeout.value = setTimeout(roll, time)
    console.log("Rolling", timeout.value, time )
    Roller.rollAll();

  } else {
    clearTimeout(timeout.value);
  }
}

function change() {
  if(isRolling.value) {
    console.log("start auto rolling", getTime())
    timeout.value = setTimeout(roll, getTime())
  } else {
    console.log("stop auto rolling")
    clearTimeout(timeout.value);
  }
  save()
}



function restart() {
  if(isRolling.value) {
    console.log("restarting rolling", getTime())
    clearTimeout(timeout.value);
    timeout.value = setTimeout(roll, getTime())
  }
  save();
}

watch(rollSec, restart);
watch(rollMins, restart);


</script>

<template>
  <div>
    <div class="inline-block mx-2"><Checkbox v-model="isRolling" binary class="" @change="change"/></div>
    <div class="inline-block">Roll every</div>
    <div class="inline-block mx-1 w-12" ><InputNumber v-model="rollMins" fluid/></div>
    <div class="inline-block">min and</div>
    <div class="mx-1 w-12 inline-block"><InputNumber v-model="rollSec" :min="0" :max="60" fluid/></div>seconds
  </div>


</template>

<style scoped lang="scss">
@use "../../assets/styles/dc/DCHead" as *;
</style>
