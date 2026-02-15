<script setup lang="ts">
import {ref} from 'vue'
import RollTooltip from "./RollTooltip.vue";
import {proficiencyEnum, type RollInfo, type RollResult, sucessAsString, sucessEnum} from "../ts/types.ts";
import {calculateResultBase, calculateRollResult} from "../ts/rolling.ts";


interface Props {
  DC: number,
  focus: boolean,
  hideMods: boolean,
  rollInfo: RollInfo
}

const {DC, focus, hideMods, rollInfo} = defineProps<Props>();



const hover = ref<boolean>(false);
const rollResult = ref<RollResult>({bonus: 0, proficiency: 0, passive: 0, activePenalty: 0});

const negativeMods = ref<Array<number>>([-1, -2, -3, -4]);
const positiveMods = ref<Array<number>>([1, 2, 3, 4]);

const positiveModsResults = ref<Map<number, sucessEnum>>(new Map<number, sucessEnum>())
const negativeModsResults = ref<Map<number, sucessEnum>>(new Map<number, sucessEnum>())


function firstHalf<Type>(arr: Array<Type>) {
  let half = Math.ceil(arr.length / 2)
  return arr.slice(0, half);
}

function secondHalf<Type>(arr: Array<Type>) {
  let half = Math.ceil(arr.length / 2)
  return arr.slice(half, arr.length);
}


function profString(info: RollInfo) {
  if (info.training === proficiencyEnum.U && info.untrainedImprovisation) {
    return "UI";
  }
  return info.training as string
}


function updateBaseline() {
  rollResult.value = calculateResultBase(rollInfo)

  positiveModsResults.value.clear()
  negativeModsResults.value.clear()
}

function generateRoll() {

  console.info("Rolling", rollInfo.rollType)

  rollResult.value.roll = Math.floor(Math.random() * 20) + 1;
  rollResult.value.total = rollResult.value.bonus + rollResult.value.roll;
  rollResult.value.result = calculateRollResult(DC, rollResult.value.roll, rollResult.value.bonus, 0)

  positiveMods.value.forEach((mod: number) => {
    positiveModsResults.value.set(mod, calculateRollResult(DC, rollResult.value.roll ?? 0, rollResult.value.bonus, mod))
  })

  positiveMods.value.forEach(mod => {
    negativeModsResults.value.set(mod, calculateRollResult(DC, rollResult.value.roll ?? 0, rollResult.value.bonus, mod))
  })
}

function getSucessAsString(en : sucessEnum | undefined)
{
    return sucessAsString[en ?? sucessEnum.F]
}


watch(() => rollInfo, (u : RollInfo) => {
  if(u != rollInfo){
    console.log("Baseline Update", u.rollType, )
    updateBaseline();
    generateRoll();
  }
})

watch(() => DC, (u) => {
  generateRoll();
})

defineExpose({generateRoll})
updateBaseline()
generateRoll()

</script>


<template>
  <div class="center relative"
       @mouseover="hover = true"
       @mouseleave="hover = false"
  >
    <div class="inline-block align-middle">
      <div class="relative w-fit m-auto">
        <div class="modifiers left  align-middle inline-block">
          <div class="">
            <div class="mod inline-block" v-for="b in firstHalf(negativeMods)"
                 :style="{visibility: hover ? 'visible' : 'hidden'}"
                 v-bind:class="getSucessAsString(negativeModsResults.get(b))">{{ b }}
            </div>
          </div>
          <div class="">
            <div class="mod inline-block" v-for="b in secondHalf(negativeMods)"
                 :style="{visibility: hover ? 'visible' : 'hidden'}"
                 v-bind:class="getSucessAsString(negativeModsResults.get(b))">{{ b }}
            </div>
          </div>
        </div>

        <RollTooltip :DC="DC" :rollInfo="rollInfo" :roll-result="rollResult">
          <div @dblclick="generateRoll" class="">
            <div
                v-bind:class="[(focus) ? getSucessAsString(rollResult.result) : 'roll-unfocused', {'n20' : focus && rollResult.roll === 20, 'n1' : focus && rollResult.roll === 1}]"
                class="roll-result">
              <div class="inline-block relative w-11  text-center">{{ rollResult.total }}
                <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
                  {{ profString(rollInfo) }}
                </div>
              </div>

            </div>
          </div>
        </RollTooltip>

        <div class="modifiers right">
          <div style="margin:0; padding: 0">
            <div class="mod unselectable inline-block" v-for="b in firstHalf(positiveMods)"
                 :style="{visibility: hover ? 'visible' : 'hidden'}"
                 v-bind:class="getSucessAsString(positiveModsResults.get(b))">+{{ b }}
            </div>
          </div>
          <div class="">
            <div class="mod unselectable inline-block" v-for="b in secondHalf(positiveMods)"
                 :style="{visibility: hover ? 'visible' : 'hidden'}"
                 v-bind:class="getSucessAsString(positiveModsResults.get(b))">+{{ b }}
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="absolute align-top inline-block ml-1 justify-center px-1 roll_details bg-gray-600">
      <div class="leading-none w-fit mx-auto text-xs tracking-tighter">
        <div class="text-right ">
          <span class="" style="letter-spacing: -0.1em; margin-left: -4pt">{{ rollResult.bonus < 0 ? '-' : '+' }}</span>{{ Math.abs(rollResult.bonus) }}
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
@use "../assets/styles/table/roll-box" as *;


</style>
