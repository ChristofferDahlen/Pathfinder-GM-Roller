<script setup lang="ts">

import Button from "primevue/button";
import {ref} from "vue";
import {DC} from "../ts/sharedResources";

const simpleDCs = ref([
  {
    desc: "Untrained",
    value: 10
  },
  {
    desc: "Trained",
    value: 15
  }, {
    desc: "Expert",
    value: 20
  }, {
    desc: "Master",
    value: 30
  },
  {
    desc: "Legendary",
    value: 40
  },
])


</script>

<template>
  <div class="inline-block" v-for="dc in simpleDCs">
    <div class="inline-block m-auto p-1">
      <Button class="diff-button right block" color="primary" outlined
              @click="DC.set(dc.value, true)">
        <div class="inline-block font-bold w-16 mr-2  ">{{ dc.desc }}</div>
        <div class="inline-block bg-primary rounded-md bg-opacity-10  ml-2 w-6 text-center ">{{ dc.value }}</div>
      </Button>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
