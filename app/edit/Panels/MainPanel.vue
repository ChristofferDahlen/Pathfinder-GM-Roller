<script setup lang="ts">

import type {iCharacter} from "../../ts/types";
import {Attribute} from "../../ts/types";
import {ref} from "vue";
import {Select} from "primevue";

const char  = defineModel<{ char: iCharacter }>();


const keyAttr = ref([
  {key: Attribute.str, name: "Str"},
  {key: Attribute.con, name: "Con"},
  {key: Attribute.dex, name: "Dex"},
  {key: Attribute.int, name: "Int"},
  {key: Attribute.wis, name: "Wis"},
  {key: Attribute.cha, name: "Cha"},
])

</script>

<template>
  <Panel header="Main">
    <div class="">
      <div class="flex">
        <span class="p-2 flex-initial" style="min-width: 5.5rem">Character</span>
        <InputText v-model="char.name" class="flex-auto w-5" placeholder="Character Name"/>
      </div>
      <div class="flex">
        <span class="p-2 flex-initial" style="min-width: 5.5rem">Class</span>
        <InputText v-model="char.class" class="flex-auto w-5" placeholder="Class"/>
      </div>

      <div class="flex">
        <span class="flex-initial p-2" style="min-width: 5.5rem">Player</span>
        <InputText v-model="char.playerName" class="flex-auto w-8" placeholder="Player Name"/>
      </div>
      <div>
        <div class="grid grid-rows-2 grid-cols-2 pt-2 w-fit">
          <span class="inline-block p-2">Level</span>
          <InputNumber
              v-model="char.level" class="number" show-buttons
              button-layout="horizontal"
              fluid
              :min="0" :max="30">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
          <span class="p-2 flex-initial" style="min-width: 5.5rem">Check penalty</span>
          <InputNumber
              v-model="char.checkPenalty" class="number" show-buttons
              button-layout="horizontal"
              fluid :min="-10" :max="0">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
          <span class="p-2 flex-initial" style="min-width: 5.5rem">Key Attribute</span>
          <Select
              v-model="char.keyAbility" :options="keyAttr"
              option-label="name" option-value="key"
              placeholder="Key Att"/>

        </div>
        <div class="m-2">Untrained Improvisation
          <Checkbox v-model="char.untrainedImprovisation" binary/>
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
