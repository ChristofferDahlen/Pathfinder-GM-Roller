<script setup lang="ts">


import type {RollInfo} from "../../ts/types.ts";
import type {RollResult} from "../../ts/rolling";

const input = defineProps<{
  dc: number,
  rollInfo: RollInfo
  rollResult: RollResult
}>()

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


</script>

<template>

  <div class="tooltip">
    <div class="tooltiptext">
      <div class="tooltipbox flex-auto">
        <div class="border-b w-full block pl-2 pr-2">
          <div
              class="inline-block pr-1"
              :class="(input.DC > 0) ? 'border-r':''">
            <div class="roll-pad">
              <div class="roll-result">{{ rollResult.roll }}</div>
              <div class="roll-desc">Roll</div>
            </div>
            <div v-if="input.rollInfo.attrValue !== 0" class="addition"> {{
                (input.rollInfo.attrValue > 0) ? '+' : '-'
              }}
            </div>
            <div v-if="input.rollInfo.attrValue !== 0" class="roll-pad">
              <div class="roll-result">{{ Math.abs(input.rollInfo.attrValue) }}</div>
              <div class="roll-desc">{{ capitalizeFirstLetter(input.rollInfo.attrType.toString()) }}</div>
            </div>
            <div v-if="input.rollResult.proficiency !== 0" class="addition">
              {{ (input.rollResult.proficiency > 0) ? '+' : '-' }}
            </div>
            <div v-if="input.rollResult.proficiency !== 0" class="roll-pad">
              <div class="roll-result">{{ Math.abs(input.rollResult.proficiency) }}</div>
              <div class="roll-desc">Prof</div>
            </div>
            <div v-if="input.rollInfo.item !== 0" class="addition"> {{ (input.rollInfo.item > 0) ? '+' : '-' }}</div>
            <div v-if="input.rollInfo.item !== 0" class="roll-pad">
              <div class="roll-result">{{ Math.abs(input.rollInfo.item) }}</div>
              <div class="roll-desc">Item</div>
            </div>
            <div v-if="input.rollInfo.penalty !== 0" class="addition"> {{
                (input.rollInfo.penalty > 0) ? '+' : '-'
              }}
            </div>
            <div v-if="input.rollInfo.penalty !== 0" class="roll-pad">
              <div class="roll-result">{{ Math.abs(input.rollInfo.penalty) }}</div>
              <div class="roll-desc">Pen</div>
            </div>
          </div>
          <div class="inline-block pl-1">
            <div v-if="input.DC !== 0" class="roll-pad">
              <div class="roll-result">{{ Math.abs(input.DC) }}</div>
              <div class="roll-desc">DC</div>
            </div>
          </div>
        </div>
        <div v-if="input.rollInfo.rollType">{{ input.rollInfo.rollType }}</div>
      </div>
    </div>
    <slot/>
  </div>

</template>


<style scoped lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltiptext {
  position: absolute;
  display: block;
  flex-direction: row;
  visibility: hidden;

  flex: 100%;
  width: 12rem;
  text-align: center;
  vertical-align: top;

  /* Position the RollTooltip.vue text - see examples below! */
  z-index: 4;
  top: 90%;
  left: 50%;
  margin-left: -6rem; /* Use half of the width (120/2 = 60), to center the RollTooltip.vue */
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  bottom: 100%; /* At the top of the RollTooltip.vue */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}

/* Show the RollTooltip.vue text when you mouse over the RollTooltip.vue container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  transform: translate3d(0, 10%, 0);
  transition: all 0.4s 1s ease;
}

.tooltipbox {
  height: 100%;
  width: fit-content;
  background: black;
  border-radius: 6px;
  margin: auto;
  @apply text-white;
}

.roll-result {
  vertical-align: top;
  font-size: small;
}

.roll-desc {
  font-size: xx-small;
}

.roll-pad {
  display: inline-block;
  vertical-align: bottom;
}

.addition {
  @extend .roll-result;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin-right: 0;
  margin-left: 0;
  margin-bottom: auto;
}
</style>
