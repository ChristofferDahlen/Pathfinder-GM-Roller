
<script setup lang="ts">
import {evaluateRollBonuses, getProficiencyString} from "../../ts/rolling";
import type {RollInfo} from "../../ts/types.ts";


defineProps<{
  rollInfo: RollInfo
}>()


</script>

<template>
  <div class="ac-box">
    <div class="inline-block relative w-11  text-center">{{ evaluateRollBonuses(rollInfo).passive }}
      <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
        {{ getProficiencyString(rollInfo) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/styles/box-base" as *;

.ac-box {
  @extend .box-base;

  @apply bg-orange-900;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  width: fit-content;

}

</style>
