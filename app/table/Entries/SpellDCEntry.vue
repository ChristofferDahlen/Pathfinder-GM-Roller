<script setup lang="ts">
import {calculateDC, getProficiencyString} from "../../ts/rolling";
import {attEnum, type iDC, proficiencyEnum} from "../../ts/types";
import {capitalize} from "vue";


const dc = defineModel<iDC>()

interface Props {
  name: string
  training: proficiencyEnum,
  attr: number,
  level: number,
  item: number,
  attrType: attEnum,
}

const { name = "Type", training = proficiencyEnum.U, attr = 0, level = 0, attrType = attEnum.str } = defineProps<Props>()


</script>

<template>
  <div>{{ capitalize(name) }}</div>
  <div>
  <div class="ac-box border-b-gray-500" style="border-color:grey">
    <div class="inline-block relative w-11  text-center">{{ calculateDC(attr, level, training, item)}}
      <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
        {{ getProficiencyString(training) }}
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/styles/table/ac-box" as *;

</style>
