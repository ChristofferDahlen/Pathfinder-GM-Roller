<script setup lang="ts">

import Button from "primevue/button";

const emit = defineEmits<{set : [value: number, saveOld: boolean]}>()
import c from "../../assets/dc_by_lvl.json"
import d from "../../assets/dc_by_spell_rank.json"

const dc_by_level = ref(c)
const dc_by_spell_rank = ref(d)

import {DC} from "../../ts/sharedResources"

</script>

<template>
  <span class="font-bold">DCs by level</span>
      <div class="grid grid-cols-5 grid-flow-rows gap-2 gap-x-2">
        <Button v-for="dc in dc_by_level" color="primary" outlined
                @click="DC.set(dc.dc, true)">
          <div class="w-5 m-auto text-center font-bold">{{ dc.level }}</div>
          <div class="w-7 bg-primary rounded-md bg-opacity-10  text-center">{{ dc.dc }}</div>
        </Button>
      </div>
  <span class="font-bold">DCs by Spell Ranks</span>

  <div class="grid grid-cols-5 grid-flow-rows gap-2 gap-x-2">
    <Button v-for="dc in dc_by_spell_rank" color="primary" outlined
            @click="DC.set(dc.dc, true)">
      <div class="w-5 m-auto text-center font-bold">{{ dc.level }}</div>
      <div class="w-7 bg-primary rounded-md bg-opacity-10  text-center">{{ dc.dc }}</div>
    </Button>

  </div>
</template>

<style scoped lang="scss">

</style>
