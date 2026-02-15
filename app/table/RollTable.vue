<script setup lang="ts">

import {type selectable, Selected} from "../ts/sharedResources.ts";
import Checkbox from "primevue/checkbox";
import ACEntry from "./Entries/ACEntry.vue";
import RollEntry from "./Entries/RollEntry.vue";
import {capitalize, ref} from "vue";
import {
  skillEnum,
  type iSkillTable,
  type iSelectedDisplay,
  attrBase,
  attEnum,
  defenseEnum,
  miscEnum,
  type RollInfo,
  type iCharacters, type iCharacter
} from "../ts/types";
import {onMounted, onUnmounted, watch} from "vue";
import ClassEntry from "./Entries/ClassDCEntry.vue";
import SpellDCEntry from "./Entries/SpellDCEntry.vue";
import {DC} from "../ts/sharedResources"


const characters = defineModel<iCharacters>({required: true});


defineExpose({rollAll});
const props = defineProps<{
  partyName: string
}>()

const controlPressed = ref<boolean>(false)

onMounted(() => {
  document.addEventListener('keydown', keydown)
  document.addEventListener('keyup', keyup)
})

onUnmounted(() => {
  document.removeEventListener('keydown', keydown)
  document.removeEventListener('keyup', keyup)

})

function keydown(key: KeyboardEvent) {
  if (key.key === "Control") {
    controlPressed.value = true;
  }
}

function keyup(key: KeyboardEvent) {
  if (key.key === "Control") {
    controlPressed.value = false;
  }
}



watch(characters, () => {
  console.log("Party")
  updateLores();
  updateDCs();
})








type RollEntryType = InstanceType<typeof RollEntry>

type charRollers = Map<string, RollEntryType>
type rollerDict = Map<string | number, charRollers>


const roller = ref<rollerDict>(new Map<string, charRollers>)




function setRoller(skillKey : string | number, charKey : string,  roll :  RollEntryType) {
  if((!roller.value.has(skillKey)))
    roller.value.set(skillKey, new Map<string, RollEntryType>());
  roller.value.get(skillKey)?.set(charKey, roll);
}

function rollCharacter(charKey: string) {
  console.log("Roll Character", charKey);

  roller.value.forEach((inner, key) => {
    inner.get(charKey)?.generateRoll();
  })
}

function rollSkill(skillKey: string | number) {
  const key = skillKey.toString();
  console.log("Roll Skill ", skillKey, key);
  const innerRoller = roller.value.get(key)
  console.log("innerRoller", innerRoller)

  innerRoller?.forEach((value, key) => {
    console.log(key)
    value?.generateRoll();
  })

}

function rollAll() {
  console.log("Roll All")

  roller.value.forEach(inner => {
    inner?.forEach(r => r?.generateRoll())
  })
}


function updateLores() {
  console.info("Update Lores")
  let maxCount = 0
  const char = characters.value;

  char.forEach((char: iCharacter) => {
    console.log("---CI", char)
    maxCount = Math.max(maxCount, char.lores.length);
  })

  if(maxCount < Selected.lores.length)
  {
    Selected.lores = Selected.lores.slice(0, maxCount)
  } else if(maxCount > Selected.lores.length) {
    let numToAdd = maxCount - Selected.lores.length;
    for (let i = 0; i < numToAdd; i++) {
      Selected.lores.push({selected: true, hover: false})
    }
  }
}

const SpellDCCount = ref<number[]>([])

function updateDCs() {
  var maxSpellDCCount = 0;
  characters.value.forEach((char: iCharacter) => {
    maxSpellDCCount = Math.max(maxSpellDCCount, char.spellDCs.length);
  })
  SpellDCCount.value = Array.from(Array(maxSpellDCCount).keys());
}


function selectOnly(skill: selectable) {
  if(controlPressed.value == true)
    Selected.selectOnly(skill)
}

function selectOnlyLore(skill: number) {
  if(controlPressed.value == true)
    Selected.selectOnlyLore(skill)
}



updateLores()
updateDCs()
</script>


<template>
  <table class="main-table w-9/12" style="border-collapse: collapse">
    <thead class="w-full">
    <tr class="main-table-header z-20" style="position: sticky; top: 0; z-index: 10;">
      <th class="p-2">
        <Checkbox v-model="Selected.checkAll" :indeterminate="Selected.checkAllIntermediate"
                  @update:model-value="u => Selected.selectTotal(u)"
                  binary></Checkbox>
      </th>
      <th >
        <div v-if="partyName">
          <div>Party</div>
          <div class="italic">{{partyName}}</div>
        </div>
      </th>
      <th v-for="char in characters" :key="char.name">
        <div class="" @dblclick="() => rollCharacter(char.key)">
          <div class="text-2xl"> {{ char.name }}</div>
          <div class="opacity-50">{{ char.class }} {{ char.level }}</div>
          <div class="opacity-50">{{ char.playerName }}</div>
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class="">
      </td>
    </tr>
    <tr>
      <td></td>
      <td class="roll-type">AC</td>
      <td v-for="char in characters" class="relative">
        <ACEntry :AC="char.protection.ac" :shield="char.protection.shield"></ACEntry>
      </td>
    </tr>
    <tr>
      <td></td>
      <td class="roll-type">Resistances</td>
      <td v-for="char in characters" :key="char.name">
        <div class="flex content-center justify-center">
          <div v-for="r in char.resistances" class="" :key="r.name">
            <div v-if="r.name!=''" class="border mx-1 px-1 border-green-600 rounded inline-flex">{{
                capitalize(r.name)
              }} {{ r.value }}
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td></td>
      <td class="roll-type">Vulnerabilities</td>
      <td v-for="char in characters">
        <div class="flex content-center justify-center">
          <div v-for="r in char.vulnerabilities" class="">
            <div v-if="r.name!=''" class="border mx-1 px-1 border-red-600 rounded inline-flex">{{
                capitalize(r.name)
              }} {{ r.value }}
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr         @mouseover="Selected.perception.hover = true"
                @mouseleave="Selected.perception.hover = false"
    >
      <td>
        <Checkbox v-model="Selected.perception.selected" @click="selectOnly('perception')" class="align-middle"
                  :binary="true"></Checkbox>
      </td>
      <td class="roll-type">Perception</td>
      <td v-for="char in characters" class="relative" :key="char.name">
        <div>
          <RollEntry :ref="(el) => setRoller('perception', char.key, el as RollEntryType)"
                     :DC="DC.value"
                     :focus="(Selected.perception.selected || Selected.perception.hover)"
                     :hideMods="false"
                     :rollInfo="{
                     rollType: capitalize(miscEnum.perception.toString()),
                     attrType: attEnum.wis,
                     attrValue: char.attributes[attEnum.wis],
                     training: char.proficiencies.perception,
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item.perception,
                     penalty: char.checkPenalty } as RollInfo"/>
        </div>
      </td>
    </tr>
    <tr>
      <td></td>
      <td class="roll-type">Class DC</td>
      <td v-for="char in characters" class="relative" :key="char.name">
        <div>
          <ClassEntry
              :rollInfo="{
                    rollType: 'ClassDC',
                     attrType: char.keyAbility,
                     attrValue: char.attributes[char.keyAbility],
                     training: char.proficiencies.classDC,
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item.classDC,
                     penalty: 0 } as RollInfo">
          </ClassEntry>
        </div>
      </td>
    </tr>


    <tr v-for="spellIndex in SpellDCCount" :key="'DC' + spellIndex">
      <td></td>
      <td class="roll-type">Spell DC {{ SpellDCCount.length > 1 ? spellIndex : "" }}</td>
      <td v-for="char in characters" class="relative" :key="char + 'roll_type'">
        <div v-if="spellIndex < char.spellDCs.length && char.spellDCs[spellIndex]?.name != ''">
          <SpellDCEntry
              :name="char.spellDCs[spellIndex]!.name"
              :training="char.spellDCs[spellIndex]!.proficiency"
              :attr="char.attributes[char.spellDCs[spellIndex]!.keyAttr]"
              :level="char.level"
              :item="char.spellDCs[spellIndex]!.item"
              :attrType="char.spellDCs[spellIndex]!.keyAttr">
          </SpellDCEntry>
        </div>
      </td>
    </tr>


    <tr v-for="s in skillEnum" :key="s"
        @mouseover="Selected[s].hover = true"
        @mouseleave="Selected[s].hover = false"
        :class="(true) ? 'divider' : '' " class="mt-10"
    >
      <td>
        <Checkbox v-model="Selected[s].selected" @click="selectOnly(s)" class="align-middle"
                  :binary="true"></Checkbox>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(s)">
        {{ capitalize(s) }}
      </td>
      <td v-for="char in characters" class="" style="width: 2000px" ref="{{char.name}}">
        <RollEntry :ref="(el) => setRoller(s, char.key, el as RollEntryType)"
                   :DC="DC.value"
                   :focus="(Selected[s].selected || Selected[s].hover)"
                   :hideMods="false"
                   :rollInfo="{
                     rollType: capitalize(s),
                     attrType: attrBase[s],
                     attrValue: char.attributes[attrBase[s]],
                     training: char.proficiencies[s],
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item[s],
                     penalty: char.checkPenalty } as RollInfo"/>
      </td>
    </tr>
    <tr v-for="loreIndex in Selected.loreKeys()" :key="'l' + loreIndex"
        @mouseover="Selected.lores[loreIndex]!.hover = true"
        @mouseleave="Selected.lores[loreIndex]!.hover = false"
        :class="(loreIndex == 0) ? 'divider' : '' " class="mt-10"
    >
      <td>
        <Checkbox v-model="Selected.lores[loreIndex]!.selected" @click="selectOnlyLore(loreIndex)" class="align-middle"
                  :binary="true"></Checkbox>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(loreIndex)">
        Lore {{ loreIndex + 1 }}
      </td>
      <td v-for="char in characters" class="" style="width: 2000px" ref="{{char.name}}">
        <div v-if="loreIndex < char.lores.length && char.lores[loreIndex]!.name != ''">
          <div>{{ capitalize(char.lores[loreIndex]!.name) }}</div>
          <div>
            <RollEntry :ref="(el) => setRoller(loreIndex, char.key, el as RollEntryType)"
                :DC="DC.value"
                :focus="(Selected.lores[loreIndex]!.selected || Selected.lores[loreIndex]!.hover)"
                :hideMods="false"
                :rollInfo="{
                     rollType: char.lores[loreIndex]!.name,
                     attrType: attEnum.int,
                     attrValue: char.attributes.int,
                     training: char.lores[loreIndex]!.proficiency,
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.lores[loreIndex]!.item,
                     penalty: char.checkPenalty } as RollInfo"/>
          </div>
        </div>
      </td>


    </tr>

    </tbody>

  </table>

</template>

<style scoped lang="scss">
.main-table {
  top: 0;
  left: 0;
  z-index: 0;
  height: 99vh;
  text-align: center;
  table-layout: fixed;
  overflow: scroll;
  display: inline-block;
}


.main-table-header {
  @apply bg-surface-950;
  @apply dark:bg-surface-200;
  @apply text-white;

  .th {
    @apply bg-surface-500;
    @apply dark:bg-surface-200;
    @apply text-white;
  }
}

.main-table tr:nth-child(even) {
  @apply bg-surface-200;
  @apply dark:bg-surface-800;
}


.main-table tr:nth-child(odd) {
  @apply bg-surface-300;
  @apply dark:bg-surface-900;
}
</style>
