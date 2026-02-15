<script setup lang="ts">


import type {RollInfo, RollResult} from "../../ts/types.ts";

const input = defineProps<{
  DC: number,
  rollInfo: RollInfo
  rollResult: RollResult
}>()

function capitalizeFirstLetter(str : string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


</script>

<template>

  <div class="tooltip">
    <div class="tooltiptext">
      <div class="tooltipbox flex-auto">
        <div class="border-b w-full block pl-2 pr-2">
          <div class="inline-block pr-1"
               :class="(input.DC > 0) ? 'border-r':''">
            <div class="roll-pad">
              <div class="roll-result">{{ rollResult.roll }}</div>
              <div class="roll-desc">Roll</div>
            </div>
            <div class="addition" v-if="input.rollInfo.attrValue !== 0"> {{ (input.rollInfo.attrValue > 0) ? '+' : '-' }}</div>
            <div class="roll-pad" v-if="input.rollInfo.attrValue !== 0">
              <div class="roll-result">{{ Math.abs(input.rollInfo.attrValue) }}</div>
              <div class="roll-desc">{{ capitalizeFirstLetter(input.rollInfo.attrType.toString()) }}</div>
            </div>
            <div class="addition" v-if="input.rollResult.proficiency !== 0">
              {{ (input.rollResult.proficiency > 0) ? '+' : '-' }}</div>
            <div class="roll-pad" v-if="input.rollResult.proficiency !== 0">
              <div class="roll-result">{{ Math.abs(input.rollResult.proficiency) }}</div>
              <div class="roll-desc">Prof</div>
            </div>
            <div class="addition" v-if="input.rollInfo.item !== 0"> {{ (input.rollInfo.item > 0) ? '+' : '-' }}</div>
            <div class="roll-pad" v-if="input.rollInfo.item !== 0">
              <div class="roll-result">{{ Math.abs(input.rollInfo.item) }}</div>
              <div class="roll-desc">Item</div>
            </div>
            <div class="addition" v-if="input.rollInfo.penalty !== 0"> {{ (input.rollInfo.penalty > 0) ? '+' : '-' }}</div>
            <div class="roll-pad" v-if="input.rollInfo.penalty !== 0">
              <div class="roll-result">{{ Math.abs(input.rollInfo.penalty) }}</div>
              <div class="roll-desc">Pen</div>
            </div>
          </div>
          <div class="inline-block pl-1">
            <div class="roll-pad" v-if="input.DC !== 0">
              <div class="roll-result">{{ Math.abs(input.DC) }}</div>
              <div class="roll-desc">DC</div>
            </div>
          </div>
        </div>
        <div v-if="input.rollInfo.rollType">{{ input.rollInfo.rollType }}</div>
      </div>
    </div>
    <slot></slot>
  </div>

</template>


<style scoped lang="scss">
@use "../../assets/styles/table/tooltip" as *;

</style>
