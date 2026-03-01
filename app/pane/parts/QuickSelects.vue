<script setup lang="ts">

import Button from "primevue/button";
import {capitalize} from "vue";
import {type iSkillTable, Skills} from "../../ts/types.ts";
import {Selected} from "../../ts/sharedResources";

interface sklist {
  trait: string,
  skills: Array<keyof iSkillTable | string>,
}

const creatureTable : Array<sklist> = [
  {trait: "Magic", skills: [Skills.arcana, Skills.nature, Skills.occultism, Skills.religion]},
  {trait: "Social", skills: [Skills.deception, Skills.diplomacy, Skills.intimidation, Skills.performance]},
  {trait: "Stealth", skills: [Skills.stealth, Skills.thievery]},
  {trait: "Physical", skills: [Skills.acrobatics, Skills.athletics, Skills.thievery]},
  {trait: "Survival", skills: [Skills.medicine, Skills.survival]},
  {trait: "Knowledge", skills: [Skills.arcana, Skills.crafting, Skills.medicine, Skills.nature, Skills.occultism, Skills.religion, Skills.society, Skills.survival, "lore"]},
]

</script>

<template>
  <table class="w-full">
    <thead>
    <tr>
      <th>Category</th>
      <th>Skills</th>
    </tr>

    </thead>
    <tbody>
    <tr v-for="creat in creatureTable" :key="creat.trait">
      <td>{{creat.trait}}</td>
      <td>
        <div v-for="skill in creat.skills" :key="skill" class="px-2 inline-block">{{capitalize(skill)}}</div>
      </td>
      <td>
        <Button @click="Selected.selectSkills(creat.skills)">Select</Button>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<style scoped lang="scss">

</style>
