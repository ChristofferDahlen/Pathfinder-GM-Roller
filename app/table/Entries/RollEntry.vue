<script setup lang="ts">
import { ref} from 'vue'
import RollTooltip from "./RollTooltip.vue";
import type {RollInfo} from "../../ts/types.ts";
import type {
  RollOutcome, RollResult
} from "../../ts/rolling.ts";
import {
  calculateRollResult,
  evaluateRollBonuses,
  getProficiencyString,
  SuccessAsString
} from "../../ts/rolling.ts";
import {DC} from "../../ts/sharedResources"


interface Props {
  focus: boolean,
  hideMods: boolean,
  rollInfo: RollInfo
}

const {focus, rollInfo} = defineProps<Props>();

const hover = ref<boolean>(false);
const rollResult = ref<RollResult>({bonus: 0, proficiency: 0, passive: 0, activePenalty: 0});

const negativeMods = ref<Array<number>>([-1, -2, -3, -4]);
const positiveMods = ref<Array<number>>([1, 2, 3, 4]);

const positiveModsResults = ref<Map<number, RollOutcome>>(new Map<number, RollOutcome>())
const negativeModsResults = ref<Map<number, RollOutcome>>(new Map<number, RollOutcome>())


function splitArray<Type>(arr: Array<Type>, part: "first" | "second"): Array<Type> {
  const halfLength = Math.ceil(arr.length / 2);
  return part === "first" ? arr.slice(0, halfLength) : arr.slice(halfLength);
}

function updateBaseline() {
  rollResult.value = evaluateRollBonuses(rollInfo);
  positiveModsResults.value.clear();
  negativeModsResults.value.clear();
}

function applyModifiers(
    modifiers: Array<number>,
    resultMap: Map<number, RollOutcome>,
    roll: number,
    bonus: number,
    dc: number
) {
  modifiers.forEach((mod) =>
      resultMap.set(mod, calculateRollResult(dc, roll ?? 0, bonus + mod))
  );
}

function generateRoll() {
  const randomRoll = Math.floor(Math.random() * 20) + 1;
  console.debug("Rolling", rollInfo.rollType)

  rollResult.value = {
    ...rollResult.value,
    roll: randomRoll,
    total: rollResult.value.bonus + randomRoll,
    result: calculateRollResult(DC.value, randomRoll, rollResult.value.bonus, 0),
  };
  //console.debug("Rolling", rollInfo.rollType, "bonus:", rollResult.value.bonus, "Total:", rollResult.value.total, "Result:", rollResult.value.result);

  applyModifiers(positiveMods.value, positiveModsResults.value, randomRoll, rollResult.value.bonus, DC.value);
  applyModifiers(negativeMods.value, negativeModsResults.value, randomRoll, rollResult.value.bonus, DC.value);
}

watch(
    () => rollInfo,
    (newRollInfo: RollInfo, oldValue: RollInfo) => {
      if (newRollInfo.attrValue !== oldValue.attrValue ||
          newRollInfo.penalty !== oldValue.penalty ||
          newRollInfo.item !== oldValue.item ||
          newRollInfo.training !== oldValue.training ||
          newRollInfo.untrainedImprovisation !== oldValue.untrainedImprovisation
      ) {

        console.log("Baseline Update", newRollInfo.rollType);
        updateBaseline();
        generateRoll();

      }
    }
);

watch(() => DC.value, generateRoll);

defineExpose({generateRoll});

// Initial Setup
updateBaseline();
generateRoll();

</script>


<template>
  <div
      :class="[focus ? '' : 'roll-unfocused']"
      class="center relative"
      @mouseleave="hover = false"
      @mouseover="hover = true"
  >
    <div class="inline-block align-middle">
      <div class="relative w-fit m-auto">
        <div class="modifiers left  align-middle inline-block">
          <div class="">
            <div
                v-for="b in splitArray(negativeMods, 'first')" :key="b" class="mod inline-block"
                :style="{visibility: hover ? 'visible' : 'hidden'}"
                :class="SuccessAsString[negativeModsResults.get(b)]">{{ b }}
            </div>
          </div>
          <div class="">
            <div
                v-for="b in splitArray(negativeMods, 'last')" :key="b" class="mod inline-block"
                :style="{visibility: hover ? 'visible' : 'hidden'}"
                :class="SuccessAsString[negativeModsResults.get(b)]">{{ b }}
            </div>
          </div>
        </div>

        <RollTooltip :dc="DC.value" :roll-info="rollInfo" :roll-result="rollResult">
          <div class="" @dblclick="generateRoll">
            <div
                :class="[ SuccessAsString[rollResult.result], {'n20' : focus && rollResult.roll === 20, 'n1' : focus && rollResult.roll === 1}]"
                class="roll-result">
              <div class="inline-block relative w-11  text-center">{{ rollResult.total }}
                <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
                  {{ getProficiencyString(rollInfo) }}
                </div>
              </div>

            </div>
          </div>
        </RollTooltip>

        <div class="modifiers right">
          <div style="margin:0; padding: 0">
            <div
                v-for="b in splitArray(positiveMods, 'first')" :key="b" class="mod unselectable inline-block"
                :style="{visibility: hover ? 'visible' : 'hidden'}"
                :class="SuccessAsString[positiveModsResults.get(b)]">+{{ b }}
            </div>
          </div>
          <div class="">
            <div
                v-for="b in splitArray(positiveMods, 'second')" :key="b" class="mod unselectable inline-block"
                :style="{visibility: hover ? 'visible' : 'hidden'}"
                :class="SuccessAsString[positiveModsResults.get(b)]">+{{ b }}
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="absolute align-top inline-block ml-1 justify-center px-1 roll_details bg-gray-600">
      <div class="leading-none w-fit mx-auto text-xs tracking-tighter">
        <div class="text-right ">
          <span class="" style="letter-spacing: -0.1em; margin-left: -4pt">{{ rollResult.bonus < 0 ? '-' : '+' }}</span>{{
            Math.abs(rollResult.bonus)
          }}
        </div>
        <div class="text-right">
          {{ rollResult.passive }}
        </div>
      </div>
    </div>
  </div>

  <!--
  <div class="m-auto w-fit border rounded text-primary font-bold">21</div>
  <div v-show="hover" class="text-xs m-2">+1</div>
-->
</template>


<style scoped lang="scss">
@use "../../assets/styles/table/roll-box" as *;


</style>
