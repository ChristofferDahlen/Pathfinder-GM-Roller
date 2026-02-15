<script setup lang="ts">

import Button from "primevue/button";
import {capitalize} from "vue";
import {type iSkillTable, skillEnum} from "../ts/types.ts";
import {Selected} from "../ts/sharedResources";

interface sklist {
  trait: string,
  skills: Array<keyof iSkillTable | string>,
}

const creatureTable : Array<sklist> = [
  {trait: "Magic", skills: [skillEnum.arcana, skillEnum.nature, skillEnum.occultism, skillEnum.religion]},
  {trait: "Social", skills: [skillEnum.deception, skillEnum.diplomacy, skillEnum.intimidation, skillEnum.performance]},
  {trait: "Stealth", skills: [skillEnum.stealth, skillEnum.thievery]},
  {trait: "Physical", skills: [skillEnum.acrobatics, skillEnum.athletics, skillEnum.thievery]},
  {trait: "Survival", skills: [skillEnum.medicine, skillEnum.survival]},
  {trait: "Knowledge", skills: [skillEnum.arcana, skillEnum.crafting, skillEnum.medicine, skillEnum.nature, skillEnum.occultism, skillEnum.religion, skillEnum.society, skillEnum.survival, "lore"]},
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
