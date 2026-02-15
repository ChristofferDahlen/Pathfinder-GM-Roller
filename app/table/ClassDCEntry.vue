<script setup lang="ts">
import {calculateResultBase, profStringByInfo} from "../ts/rolling";
import type {RollInfo} from "../ts/types.ts";




const props = defineProps<{
  rollInfo: RollInfo
}>()



</script>

<template>
  <div class="ac-box border-b-gray-600" style="border-color:grey">
    <div class="inline-block relative w-11  text-center">{{ calculateResultBase(rollInfo).passive }}
      <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
        {{ profStringByInfo(rollInfo) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/styles/table/ac-box" as *;

</style>
