<script setup lang="ts">
import {calculateDC, getProficiencyString} from "../../ts/rolling";
import {Attribute, type iDC, proficiencyLevel} from "../../ts/types";
import {capitalize} from "vue";


const dc = defineModel<iDC>()

interface Props {
  name: string
  training: proficiencyLevel,
  attr: number,
  level: number,
  item: number,
  attrType: Attribute,
}

const { name = "Type", training = proficiencyLevel.Untrained, attr = 0, level = 0, attrType = Attribute.str } = defineProps<Props>()


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
