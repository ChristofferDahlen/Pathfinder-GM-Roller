<script setup lang="ts">

import {iCharacter} from "../ts/types";

const props = defineProps<{char : iCharacter}>()

</script>

<template>
  <Panel header="Main">
    <div class="">
      <div class="flex">
        <span class="p-2 flex-initial" style="min-width: 5.5rem">Character</span>
        <InputText class="flex-auto w-5" v-model="char.name" placeholder="Character Name"></InputText>
      </div>
      <div class="flex">
        <span class="flex-initial p-2" style="min-width: 5.5rem">Player</span>
        <InputText class="flex-auto w-8" v-model="char.playerName" placeholder="Player Name"></InputText>
      </div>
      <div>
        <div class="grid grid-rows-2 grid-cols-2 pt-2 w-fit">
          <span class="inline-block p-2">Level</span>
          <InputNumber class="number" v-model="char.level" showButtons
                       buttonLayout="horizontal"
                       fluid
                       :min="0" :max="30">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
          <span class="p-2 flex-initial" style="min-width: 5.5rem">Check penatly</span>
          <InputNumber class="number" v-model="char.checkPenalty" showButtons
                       buttonLayout="horizontal"
                       fluid :min="-10" :max="0">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
          <span class="p-4 flex-initial" style="min-width: 5.5rem">Key Attribute</span>
          <Select class="inline-block" style="min-width: 10rem" v-model="char.keyAbility" :options="keyAttr"
                  optionLabel="name" optionValue="key"
                  placeholder="Key Att"></Select>

        </div>
        <div class="m-2">Untrained Improvisation
          <Checkbox v-model="char.untrainedImprovisation" binary></Checkbox>
        </div>
      </div>
    </div>
  </Panel>
</template>

<style scoped lang="scss">

.number {
  width: 8rem;
  font-size: 4rem;
  text-align: center;

}


</style>
