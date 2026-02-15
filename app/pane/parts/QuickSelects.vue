<script setup lang="ts">

import Button from "primevue/button";
import {capitalize} from "vue";
import {type iSkillTable, Skill} from "../../ts/types.ts";
import {Selected} from "../../ts/sharedResources";

interface sklist {
  trait: string,
  skills: Array<keyof iSkillTable | string>,
}

const creatureTable : Array<sklist> = [
  {trait: "Magic", skills: [Skill.arcana, Skill.nature, Skill.occultism, Skill.religion]},
  {trait: "Social", skills: [Skill.deception, Skill.diplomacy, Skill.intimidation, Skill.performance]},
  {trait: "Stealth", skills: [Skill.stealth, Skill.thievery]},
  {trait: "Physical", skills: [Skill.acrobatics, Skill.athletics, Skill.thievery]},
  {trait: "Survival", skills: [Skill.medicine, Skill.survival]},
  {trait: "Knowledge", skills: [Skill.arcana, Skill.crafting, Skill.medicine, Skill.nature, Skill.occultism, Skill.religion, Skill.society, Skill.survival, "lore"]},
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
