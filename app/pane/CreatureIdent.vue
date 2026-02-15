<script setup lang="ts">

import Button from "primevue/button";
import {capitalize, ref} from "vue";
import {Selected} from "../ts/sharedResources";

const creatureTable = ref({
  "Aberration": ["occultism"],
  "Animal": ["nature"],
  "Astral": ["occultism"],
  "Beast": ["arcana", "nature"],
  "Celestial": ["religion"],
  "Construct": ["arcana", "crafting"],
  "Dragon": ["arcana"],
  "Dream": ["occultism"],
  "Elemental": ["arcana", "nature"],
  "Ethereal": ["occultism"],
  "Fey": ["nature"],
  "Fiend": ["religion"],
  "Fungus": ["nature"],
  "Humanoid": ["society"],
  "Monitor": ["religion"],
  "Ooze": ["occultism"],
  "Plant": ["nature"],
  "Shade": ["religion"],
  "Spirit": ["occultism"],
  "Time": ["occultism"],
  "Undead": ["religion"]
})

</script>

<template>
  <table class="w-full">
    <thead>
    <tr>
      <th>Creature Trait</th>
      <th>Skills</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(key, trait) in creatureTable">
      <td>{{trait}}</td>
      <td>
        <div v-for="skill in key" class="px-2 inline-block">{{capitalize(skill)}}</div>
      </td>
      <td>
        <Button @click="Selected.selectSkills(key)">Select</Button>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped lang="scss">

</style>
