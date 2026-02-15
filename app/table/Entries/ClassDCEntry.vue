<script setup lang="ts">
import {evaluateRollBonuses, getProficiencyString} from "../../ts/rolling";
import type {RollInfo} from "../../ts/types.ts";




const props = defineProps<{
  rollInfo: RollInfo
}>()



</script>

<template>
  <div class="ac-box border-b-gray-600" style="border-color:grey">
    <div class="inline-block relative w-11  text-center">{{ evaluateRollBonuses(rollInfo).passive }}
      <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
        {{ getProficiencyString(rollInfo) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/styles/table/ac-box" as *;

</style>
