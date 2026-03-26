<script setup lang="ts">
import {calculateDC} from "../../ts/rolling";
import {Attribute, type iDC, proficiencyLevel, ProficiencyValueMap} from "../../ts/types";
import {capitalize} from "vue";


defineModel<iDC>()

interface Props {
  name?: string
  training?: proficiencyLevel,
  attr?: number,
  level?: number,
  item: number,
  attrType?: Attribute,
}

const {
  name = "Type",
  training = proficiencyLevel.Untrained,
  attr = 0,
  level = 0,
  attrType = Attribute.str
} = defineProps<Props>()

const proficiencyLabelMap: Record<proficiencyLevel, string> = {
  [proficiencyLevel.Untrained]: "",
  [proficiencyLevel.Trained]: "T",
  [proficiencyLevel.Expert]: "E",
  [proficiencyLevel.Master]: "M",
  [proficiencyLevel.Legendary]: "L",
}

function getProficiencyLabel(p: proficiencyLevel): string {
  return proficiencyLabelMap[p] ?? ""
}


</script>

<template>
  <div>{{ capitalize(name) }}</div>
  <div>
    <div class="ac-box border-b-black">
      <div class="inline-block relative w-11  text-center">{{ calculateDC(attrType, attr, level, training, item) }}
        <div class="absolute top-0 leading-none right-0 text-xs opacity-60">
        {{ getProficiencyLabel(training) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../assets/styles/box-base" as *;

.ac-box {
  @extend .box-base;

  @apply bg-purple-900;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  width: fit-content;

}
</style>
