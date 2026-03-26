<script setup lang="ts">

import {Roller, Selected} from "../ts/sharedResources";
import Checkbox from "primevue/checkbox";
import ACEntry from "./Entries/ACEntry.vue";
import RollEntry from "./Entries/RollEntry.vue";
import {capitalize, computed, ref, watch} from "vue";
import {attrBase, Attribute, DefenseEnum, type iCharacters, miscEnum, type RollInfo, Skills} from "../ts/types";

import ClassEntry from "./Entries/ClassDCEntry.vue";
import SpellDCEntry from "./Entries/SpellDCEntry.vue";
import DefenseEntry from "./Entries/DefenseEntry.vue";
import {onShortcutKey, OrganizedSettings, shortcutsEnum} from "../ts/settings";



const characters = defineModel<iCharacters>({required: true});
defineExpose({rollAll});

defineProps<{ partyName: string }>();

watch(characters, () => {
  rollAll();
  updateLores();
});

// ── Rolling ───────────────────────────────────────────────────────────────────

type RollEntry = {
  generateRoll() : void;
}

type charRollers = Map<string, RollEntry>;
const roller = ref<Map<string, charRollers>>(new Map<string, charRollers>());

function setRoller(skillKey: string | number, charKey: string, roll: RollEntry) {
  const key = String(skillKey)
  if (!roller.value.has(key)) {
    roller.value.set(key, new Map<string, RollEntry>());
  }
  roller.value.get(key)?.set(charKey, roll);
}

function rollCharacter(characterKey: string) {
  roller.value.forEach(inner => inner.get(characterKey)?.generateRoll());
}

function rollSkill(skillKey: string | number) {
  roller.value.get(String(skillKey))?.forEach(roll => roll?.generateRoll());
}

function rollAll() {
  roller.value.forEach(inner => inner.forEach(roll => roll?.generateRoll()));
}
Roller.roller = rollAll;

// ── Skill/lore selection ──────────────────────────────────────────────────────

const isControlPressed = ref<boolean>(false);
function handleKeyEvent(event: KeyboardEvent) {
  isControlPressed.value = event.ctrlKey;
}

document.addEventListener("keydown", handleKeyEvent);
document.addEventListener("keyup", handleKeyEvent);

function selectOnly() {
  // Sure this looks wierd but the selection on the skill/lore happens after this function is called
  // So we set all to off and then its fliped on again...
  if (isControlPressed.value) Selected.value.selectNone();
}

onShortcutKey([shortcutsEnum.rollAll], (_, event) => {
  rollAll();
  event.preventDefault();
});

// ── Defenses ──────────────────────────────────────────────────────────────────
const defenseEnumMapping = {
  ShowFortitude: DefenseEnum.Fortitude,
  ShowReflex: DefenseEnum.Reflex,
  ShowWill: DefenseEnum.Will,
};

const isDefenseVisible = (key: keyof typeof defenseEnumMapping): boolean =>
    OrganizedSettings.value.Defenses[key]?.state ?? false;

const ShownDefenses = computed<DefenseEnum[]>(() => {
  const filteredKeys = Object.keys(defenseEnumMapping).filter((key) =>
      isDefenseVisible(key as keyof typeof defenseEnumMapping)
  );

  return filteredKeys.map((key) => {
    const typedKey = key as keyof typeof defenseEnumMapping;
    return defenseEnumMapping[typedKey];
  });
});

// ── Spell DCs ─────────────────────────────────────────────────────────────────

const getMaxSpellDCCount = (): number => {
  return Math.max(...characters.value.map(char => char.spellDCs.length), 0);
};

const SpellDCCount = computed<number[]>(() => {
  if (!OrganizedSettings.value.DCs.ShowSpellDC.state) {
    console.info("Spell DC display is disabled. Returning an empty array.");
    return [];
  }

  console.info("Spell DC display is enabled. Calculating Spell DC counts.");
  const maximumSpellDCs = getMaxSpellDCCount();
  return [...Array(maximumSpellDCs).keys()];
});

// ── Lores ─────────────────────────────────────────────────────────────────────
const DEFAULT_LORE = {selected: true, hover: false};

const LoreIndices = computed(() => {
  if (!OrganizedSettings.value.Skills.ShowLores.state) return [];
  return Selected.value.loreKeys();
});

function updateLores() {
  console.info("Updating lores...");
  const maximumLoreCount = calculateMaxLoreCount();
  adjustLoreCount(maximumLoreCount);
}

function calculateMaxLoreCount(): number {
  return Math.max(...characters.value.map(char => char.lores.length), 0);
}

function adjustLoreCount(targetCount: number) {
  const currentCount = Selected.value.lores.length;

  if (targetCount < currentCount) {
    Selected.value.lores = Selected.value.lores.slice(0, targetCount);
  } else if (targetCount > currentCount) {
    const newLores = Array.from({length: targetCount - currentCount}, () => ({...DEFAULT_LORE}));
    Selected.value.lores.push(...newLores);
  }
}



updateLores();
</script>


<template>
  <table class="main-table w-9/12" style="border-collapse: collapse">
    <thead class="w-full">
    <tr class="main-table-header z-20">
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
          <div v-if="OrganizedSettings.Misc.ShowClass.state" class="opacity-50 select-none">{{ char.class }} {{ char.level }}</div>
          <div v-if="OrganizedSettings.Misc.ShowPlayerName.state" class="opacity-50 select-none">{{ char.playerName }}</div>
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
      <td v-for="char in characters" :key="char.key" class="relative">
        <ACEntry :ac="char.protection.ac" :shield="char.protection.shield"/>
      </td>
    </tr>
    <tr v-for="defense in ShownDefenses" :key="defense">
      <td/>
      <td class="roll-type ">{{ capitalize(defense) }}</td>
      <td v-for="char in characters" :key="char.key" class="relative">
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
      <td v-for="char in characters" :key="char.key">
        <div class="flex content-center justify-center">
          <div v-for="r in char.vulnerabilities" :key="r.name" class="">
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
            @click="selectOnly()"/>
      </td>
      <td class="roll-type">
        <div class="roll-type">Perception</div>
      </td>
      <td v-for="char in characters" :key="char.name" class="relative">
        <div>
          <RollEntry
              :ref="(el) => setRoller('perception', char.key, el as unknown as RollEntry)"
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
            @click="selectOnly()"/>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(skill)">
        {{ capitalize(skill) }}
      </td>
      <td v-for="char in characters" :key="char.key" class="" style="width: 2000px">
        <RollEntry
            :ref="(el) => setRoller(skill, char.key, el as unknown as RollEntry)"
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
            @click="selectOnly()"/>
      </td>
      <td class="roll-type" @dblclick="() => rollSkill(loreIndex)">
        Lore {{ loreIndex + 1 }}
      </td>
      <td v-for="char in characters" :key="char.key" class="" style="width: 2000px">
        <div v-if="loreIndex < char.lores.length && char.lores[loreIndex]!.name != ''">
          <div>{{ capitalize(char.lores[loreIndex]!.name) }}</div>
          <div>
            <RollEntry
                :ref="(el) => setRoller(loreIndex, char.key, el as unknown as RollEntry)"
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

    <tr v-if="OrganizedSettings.Skills.ShowLanguages.state">
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
  @apply bg-surface-950 dark:bg-surface-200 text-white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main-table tr:nth-child(even) {
  @apply bg-surface-200 dark:bg-surface-800;
}

.main-table tr:nth-child(odd) {
  @apply bg-surface-300 dark:bg-surface-900;
}
</style>
