<script setup lang="ts">

import {type selectable, Selected} from "../ts/sharedResources.ts";
import Checkbox from "primevue/checkbox";
import ACEntry from "./Entries/ACEntry.vue";
import RollEntry from "./Entries/RollEntry.vue";
import {capitalize, computed, onMounted, onUnmounted, ref, watch} from "vue";
import {attrBase, Attribute, DefenseEnum, type iCharacters, miscEnum, type RollInfo, Skills} from "../ts/types";

import ClassEntry from "./Entries/ClassDCEntry.vue";
import SpellDCEntry from "./Entries/SpellDCEntry.vue";
import DefenseEntry from "./Entries/DefenseEntry.vue";
import {OrganizedSettings} from "../ts/settings";


const CONTROL_KEY = "Control"; // Extracted constant for control key
const isControlPressed = ref<boolean>(false);

const characters = defineModel<iCharacters>({required: true});
defineExpose({rollAll});

defineProps<{ partyName: string }>();

onMounted(setupKeyboardListeners);
onUnmounted(teardownKeyboardListeners);

watch(characters, () => {
  console.log("Party");
  updateLores();
});

const defenseMapping = {
  ShowFortitude: DefenseEnum.Fortitude,
  ShowReflex: DefenseEnum.Reflex,
  ShowWill: DefenseEnum.Will,
};

const isDefenseShown = (key: keyof typeof defenseMapping): boolean =>
    OrganizedSettings.Defenses[key]?.state ?? false;

const ShownDefenses = computed<DefenseEnum[]>(() =>
    Object.keys(defenseMapping)
        .filter((key) => isDefenseShown(key as keyof typeof defenseMapping))
        .map((key) => defenseMapping[key as keyof typeof defenseMapping])
);

const SpellDCCount = computed<number[]>(()=> {
  if(!OrganizedSettings.DCs.ShowSpellDC.state) {
    console.info("Not shwoing spell DC")
    return []
  }
  console.info("Showing spell DC");
  const maxSpellDCCount = Math.max(...characters.value.map(char => char.spellDCs.length), 0);
  return [...Array(maxSpellDCCount).keys()];
},)

const LoreIndices = computed(() => {
  if(!OrganizedSettings.Skills.ShowLores.state)
    return []
  return Selected.loreKeys()
},)



const roller = ref<rollerDict>(new Map<string, charRollers>());

function setupKeyboardListeners() {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
}

function teardownKeyboardListeners() {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("keyup", handleKeyup);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === CONTROL_KEY) isControlPressed.value = true;
}

function handleKeyup(event: KeyboardEvent) {
  if (event.key === CONTROL_KEY) isControlPressed.value = false;
}

function setRoller(skillKey: string | number, charKey: string, roll: RollEntryType) {
  if (!roller.value.has(skillKey)) {
    roller.value.set(skillKey, new Map<string, RollEntryType>());
  }
  roller.value.get(skillKey)?.set(charKey, roll);
}

function rollCharacter(characterKey: string) {
  console.log("Roll Character", characterKey);
  roller.value.forEach(inner => inner.get(characterKey)?.generateRoll());
}

function rollSkill(skillKey: string | number) {
  console.log("Roll Skill", skillKey);
  roller.value.get(skillKey.toString())?.forEach((value, key) => {
    console.log(key);
    value?.generateRoll();
  });
}

function rollAll() {
  console.log("Roll All");
  roller.value.forEach(inner => inner.forEach(roll => roll?.generateRoll()));
}

function updateLores() {
  console.info("Update Lores");
  const maxLoreCount = Math.max(...characters.value.map(char => char.lores.length), 0);
  adjustLores(maxLoreCount);
}

function adjustLores(targetCount: number) {
  const currentCount = Selected.lores.length;
  if (targetCount < currentCount) {
    Selected.lores = Selected.lores.slice(0, targetCount);
  } else if (targetCount > currentCount) {
    Selected.lores.push(...Array.from({length: targetCount - currentCount}, () => ({selected: true, hover: false})));
  }
}


function selectOnly(skill: selectable) {
  if (isControlPressed.value) Selected.selectOnly(skill);
}

function selectOnlyLore(skillIndex: number) {
  if (isControlPressed.value) Selected.selectOnlyLore(skillIndex);
}

updateLores()
</script>


<template>
  <table class="main-table w-9/12" style="border-collapse: collapse">
    <thead class="w-full">
    <tr class="main-table-header z-20" style="position: sticky; top: 0; z-index: 10;">
      <th class="p-2">
        <Checkbox
            v-model="Selected.checkAll" :indeterminate="Selected.checkAllIntermediate"
            binary
            @update:model-value="u => Selected.selectTotal(u)"/>
      </th>
      <th>
        <div v-if="partyName && OrganizedSettings.Misc.ShowPartyName.state" class="italic">
          {{ partyName }}
        </div>
      </th>
      <th v-for="char in characters" :key="char.name">
        <div class="" @dblclick="() => rollCharacter(char.key)">
          <div class="text-2xl select-none"> {{ char.name }}</div>
          <div class="opacity-50 select-none" v-if="OrganizedSettings.Misc.ShowClass.state">{{ char.class }} {{ char.level }}</div>
          <div class="opacity-50 select-none" v-if="OrganizedSettings.Misc.ShowPlayerName.state">{{ char.playerName }}</div>
        </div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td class=""/>
    </tr>
    <tr v-if="OrganizedSettings.Defenses.ShowArmorClass.state">
      <td/>
      <td class="roll-type ">AC</td>
      <td v-for="char in characters" :key="char" class="relative">
        <ACEntry :ac="char.protection.ac" :shield="char.protection.shield"/>
      </td>
    </tr>
    <tr v-for="defense in ShownDefenses" :key="defense">
      <td/>
      <td class="roll-type ">{{ capitalize(defense) }}</td>
      <td v-for="char in characters" :key="char" class="relative">
        <DefenseEntry
        :roll-info="{
          rollType: 'T',
          penalty: char.checkPenalty,
          item: char.item[defense],
          attrType: attrBase[defense],
          level: char.level,
          attrValue: char.attributes[attrBase[defense]],
          untrainedImprovisation: false,
          training: char.proficiencies[defense],
        } as RollInfo"/>
      </td>
    </tr>

    <tr v-if="OrganizedSettings.Defenses.showResistances.state">
      <td/>
      <td class="roll-type">Resistances</td>
      <td v-for="char in characters" :key="char.name">
        <div class="flex content-center justify-center">
          <div v-for="r in char.resistances" :key="r.name" class="">
            <div v-if="r.name!=''" class="border mx-1 px-1 border-green-600 rounded inline-flex">{{
                capitalize(r.name)
              }} {{ r.value }}
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr v-if="OrganizedSettings.Defenses.showVulnerabilities.state">
      <td/>
      <td class="roll-type">Vulnerabilities</td>
      <td v-for="char in characters" :key="char">
        <div class="flex content-center justify-center">
          <div v-for="r in char.vulnerabilities" :key="r" class="">
            <div v-if="r.name!=''" class="border mx-1 px-1 border-red-600 rounded inline-flex">{{
                capitalize(r.name)
              }} {{ r.value }}
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr
        v-if="OrganizedSettings.Skills.ShowPerception.state"
        @mouseover="Selected.perception.hover = true"
        @mouseleave="Selected.perception.hover = false"
    >
      <td>
        <Checkbox
            v-model="Selected.perception.selected" class="align-middle" :binary="true"
            @click="selectOnly('perception')"/>
      </td>
      <td class="roll-type">
        <div class="roll-type">Perception</div>
      </td>
      <td v-for="char in characters" :key="char.name" class="relative">
        <div>
          <RollEntry
              :ref="(el) => setRoller('perception', char.key, el as RollEntryType)"
              :focus="(Selected.perception.selected || Selected.perception.hover)"
              :hide-mods="false"
              :roll-info="{
                     rollType: capitalize(miscEnum.perception.toString()),
                     attrType: Attribute.wis,
                     attrValue: char.attributes[Attribute.wis],
                     training: char.proficiencies.perception,
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item.perception,
                     penalty: char.checkPenalty } as RollInfo"/>
        </div>
      </td>
    </tr>
    <tr v-if="OrganizedSettings.DCs.ShowClassDC.state">
      <td/>
      <td class="roll-type">Class DC</td>
      <td v-for="char in characters" :key="char.name" class="relative">
        <div>
          <ClassEntry
              :roll-info="{
                    rollType: 'ClassDC',
                     attrType: char.keyAbility,
                     attrValue: char.attributes[char.keyAbility],
                     training: char.proficiencies.classDC,
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item.classDC,
                     penalty: 0 } as RollInfo"/>
        </div>
      </td>
    </tr>


    <tr v-for="spellIndex in SpellDCCount" :key="'DC' + spellIndex">
      <td/>
      <td class="roll-type">Spell DC {{ SpellDCCount.length > 1 ? spellIndex : "" }}</td>
      <td v-for="char in characters" :key="char + 'roll_type'" class="relative">
        <div v-if="spellIndex < char.spellDCs.length && char.spellDCs[spellIndex]?.name != ''">
          <SpellDCEntry
              :name="char.spellDCs[spellIndex]!.name"
              :training="char.spellDCs[spellIndex]!.proficiency"
              :attr="char.attributes[char.spellDCs[spellIndex]!.keyAttr]"
              :level="char.level"
              :item="char.spellDCs[spellIndex]!.item"
              :attr-type="char.spellDCs[spellIndex]!.keyAttr"/>
        </div>
      </td>
    </tr>


    <tr
        v-for="skill in Skills" :key="skill"
        :class="'divider' "
        class="mt-10"
        @mouseover="Selected[skill].hover = true" @mouseleave="Selected[skill].hover = false"
    >
      <td>
        <Checkbox
            v-model="Selected[skill].selected" class="align-middle" :binary="true"
            @click="selectOnly(skill)"/>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(skill)">
        {{ capitalize(skill) }}
      </td>
      <td v-for="char in characters" :key="char" ref="{{char.name}}" class="" style="width: 2000px">
        <RollEntry
            :ref="(el) => setRoller(skill, char.key, el as RollEntryType)"
            :focus="(Selected[skill].selected || Selected[skill].hover)"
            :hide-mods="false"
            :roll-info="{
                     rollType: capitalize(skill),
                     attrType: attrBase[skill],
                     attrValue: char.attributes[attrBase[skill]],
                     training: char.proficiencies[skill],
                     untrainedImprovisation: char.untrainedImprovisation,
                     level: char.level,
                     item: char.item[skill],
                     penalty: char.checkPenalty } as RollInfo"/>
      </td>
    </tr>
    <tr
        v-for="loreIndex in LoreIndices" :key="'l' + loreIndex"
        :class="(loreIndex == 0) ? 'divider' : '' "
        class="mt-10"
        @mouseover="Selected.lores[loreIndex]!.hover = true" @mouseleave="Selected.lores[loreIndex]!.hover = false"
    >
      <td>
        <Checkbox
            v-model="Selected.lores[loreIndex]!.selected" class="align-middle" :binary="true"
            @click="selectOnlyLore(loreIndex)"/>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(loreIndex)">
        Lore {{ loreIndex + 1 }}
      </td>
      <td v-for="char in characters" :key="char" ref="{{char.name}}" class="" style="width: 2000px">
        <div v-if="loreIndex < char.lores.length && char.lores[loreIndex]!.name != ''">
          <div>{{ capitalize(char.lores[loreIndex]!.name) }}</div>
          <div>
            <RollEntry
                :ref="(el) => setRoller(loreIndex, char.key, el as RollEntryType)"
                :focus="(Selected.lores[loreIndex]!.selected || Selected.lores[loreIndex]!.hover)"
                :hide-mods="false"
                :roll-info="{
                     rollType: char.lores[loreIndex]!.name,
                     attrType: Attribute.int,
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

    <tr v-if="OrganizedSettings.Misc.ShowLanguages.state">
      <td/>
      <td class="roll-type">Languages</td>
      <td v-for="char in characters" :key="char.name">
        <div class="flex content-center justify-center flex-wrap">
          <div v-for="l in char.languages" :key="l" class="pt-1">
            <div v-if="l !=''" class="border mx-1 px-1 border-gray-500 rounded inline-flex">
              {{
                capitalize(l)
              }}
            </div>
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

.roll-type {
  font-weight: bold;
  user-select: none;
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
