<script setup lang="ts">
import {capitalize, ref} from "vue";
import {attrBase, Attribute, iCharacter, type iDC, type iLore, proficiencyLevel, Skill} from "../ts/types.js";
import {calculateBonusFromInfo, calculateProficiency} from "../ts/rolling";

const props = defineProps<{char : iCharacter, i : Number}>()

const proficiencyOptions = ref([
  {value:proficiencyLevel.Trained, name:"T"},
  {value:proficiencyLevel.Expert, name:"E"},
  {value:proficiencyLevel.Master, name:"M"},
  {value:proficiencyLevel.Legendary, name:"L"},
] )

const rNewLore = ref<string>("")
const rNewSpellDC = ref<string>("")

function addLore(iChar: number) {
  props.char.lores.push({name: capitalize(rNewLore.value), proficiency: proficiencyLevel.Untrained, item: 0})
  props.char.lores.sort(function (a : iLore, b : iLore) {
    return capitalize(a.name) > capitalize(b.name) ? 1 : -1;
  })

  rNewLore.value = ''
}

function addSpellDC(iChar: number) {
  if (rNewSpellDC.value === '')
    return

  props.char.spellDCs.push({
    name: capitalize(rNewSpellDC.value),
    keyAttr: props.char.keyAbility,
    proficiency: proficiencyLevel.Untrained,
    item: 0,
    type: "spell"
  })

  props.char.spellDCs.sort(function (a : iDC, b : iDC) {
    return capitalize(a.name) > capitalize(b.name) ? 1 : -1;
  })


  rNewSpellDC.value = ''
}

function removeLore(iChar: number, iLore: number) {
  props.char.lores.splice(iLore, 1);
}

function removeSpellDC(iChar: number, iLore: number) {
  props.char.spellDCs.splice(iLore, 1);
}

</script>

<template>
  <table class="w-full" style="border-collapse: collapse">
    <thead class="">
    <tr class="main-table-header bg-surface-950" style="position: sticky; top: 0; z-index: 1;">
      <th>
        Skill
      </th>
      <th class="px-2">
        Proficiency
      </th>
      <th class="px-2">
        Attribute
      </th>
      <th class="px-2">
        Item Bonus
      </th>
      <th class="px-2">
        Penalty
      </th>
      <th class="px-2">
        Total
      </th>
    </tr>
    </thead>
    <tbody>


    <tr v-for="skill in Skill" :key="'edit_' + skill" :class="{ editDivider : false }">
      <td class="table_skill">{{ capitalize(skill.toString()) }}</td>
      <td class="text-center">
        <div class="mx-auto">
          <SelectButton v-model="char.proficiencies[skill]"
                        :options="proficiencyOptions"
                        option-label="name"
                        optionValue="value"
                        @update:modelValue="(v) => {
                                  if(v === undefined || v === null)
                                    char.proficiencies[skill] = proficiencyLevel.Untrained
                                }"
                        :defaultValue="proficiencyLevel.Untrained"
                        allow-empty
                        data-key="value"></SelectButton>
          <div class="table_prof_num">
            {{ calculateProficiency(char.level, char.proficiencies[skill], char.untrainedImprovisation) }}
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <div class="table_attr">{{ char.attributes[attrBase[skill]] }}</div>
          <div class="table_attr_type">{{ attrBase[skill] }}</div>
        </div>
      </td>
      <td class="">
        <div class=" mx-auto text-center">
          <InputNumber class="number" v-model="char.item[skill]" showButtons
                       buttonLayout="horizontal" fluid
                       :min="0" :max="30">
            <template #incrementicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
        </div>
      </td>
      <td v-if="(attrBase[skill] === Attribute.str || attrBase[skill] === Attribute.dex)" class="text-center">
        {{ char.checkPenalty }}
      </td>
      <td v-else/>
      <td class="text-center">
        {{
        calculateBonusFromInfo({
        rollType: "T",
        penalty : char.checkPenalty,
        item: char.item[skill],
        attrType: attrBase[skill],
        level: char.level,
        attrValue: char.attributes[attrBase[skill]],
        untrainedImprovisation: char.untrainedImprovisation,
        training: char.proficiencies[skill],
        })
        }}
      </td>
    </tr>
    <tr v-for="(lore, il) in char.lores" :key="'edit_char_' + i + '_lore' + il" :class="{editDivider : il == 0}">
      <td class="text-center flex">
        <div class="mx-auto">
          <div class="table_skill inline"> {{lore.name}}</div>
          <Button outlined class="lore_button" size="small" @click="removeLore(i, il)">
            <MdiIcon icon="mdiMinus"/>
          </Button>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <SelectButton v-model="lore.proficiency"
                        :options="proficiencyOptions"
                        option-label="name"
                        optionValue="value"
                        allow-empty
                        data-key="value"></SelectButton>
          <div class="table_prof_num">
            {{calculateProficiency(char.level, lore.proficiency, char.untrainedImprovisation) }}
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <div class="table_attr">{{ char.attributes['int'] }}</div>
          <div class="table_attr_type">int</div>
        </div>
      </td>
      <td class="">
        <div class=" mx-auto text-center">
          <InputNumber class="number" v-model="lore.item" showButtons
                       buttonLayout="horizontal" fluid :min="0" :max="30">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
        </div>
      </td>
      <td></td>
      <td class="text-center">
        {{
        Number(char.attributes['int']) + Number(lore.item) + calculateProficiency(char.level, lore.proficiency,
        char.untrainedImprovisation)
        }}
      </td>

    </tr>
    <tr>
      <td class="text-center flex">
        <InputText class="lore_skill" flex placeholder="New Lore" v-model="rNewLore"></InputText>
        <Button outlined class="lore_button" @click="addLore(i)">
          <MdiIcon icon="mdiPlus"/>
        </Button>
      </td>
    </tr>
    <tr class="main-table-header bg-surface-950" style="position: sticky; top: 0; z-index: 1;">
      <th>
        DCs
      </th>
      <th class="px-2">
        Proficiency
      </th>
      <th class="px-2">
        Attribute
      </th>
      <th class="px-2">
        Item Bonus
      </th>
      <th class="px-2">
      </th>
      <th class="px-2">
        DC
      </th>
    </tr>
    <tr>
      <td class="table_skill">Class DC</td>
      <td class="text-center">
        <div class="mx-auto">
          <SelectButton v-model="char.proficiencies.classDC"
                        :options="proficiencyOptions"
                        option-label="name"
                        optionValue="value"
                        allow-empty
                        data-key="value"></SelectButton>
          <div class="table_prof_num">
            {{ calculateProficiency(char.level, char.proficiencies.classDC, false) }}
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <div class="table_attr">{{ char.attributes[char.keyAbility] }}</div>
          <div class="table_attr_type">{{ char.keyAbility }}</div>
        </div>
      </td>
      <td class="">
        <div class=" mx-auto text-center">
          <InputNumber class="number" v-model="char.item.classDC" showButtons
                       buttonLayout="horizontal" fluid
                       :min="0" :max="30">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
        </div>
      </td>
      <td/>
      <td class="text-center">
        {{
        Number(char.attributes[char.keyAbility]) + Number(char.item.classDC) + calculateProficiency(char.level,
        char.proficiencies.classDC, false)
        }}
      </td>
    </tr>
    <tr v-for="(spell, il) in char.spellDCs" :key="'edit_char_' + i + '_spell' + il">
      <td class="text-center flex">
        <div class="mx-auto">
          <div class="table_skill inline"> {{spell.name}}</div>
          <Button outlined class="lore_button" size="small" @click="removeSpellDC(i, il)">
            <MdiIcon icon="mdiMinus"/>
          </Button>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <SelectButton v-model="spell.proficiency"
                        :options="proficiencyOptions"
                        option-label="name"
                        optionValue="value"
                        @update:modelValue="(val) => {
                                  console.log('CHANGE', val)
                                  if(!(val in proficiencyLevel)){
                                    spell.proficiency = proficiencyLevel.Untrained;
                                  }
                                }"
                        allow-empty
                        data-key="value"></SelectButton>
          <div class="table_prof_num">
            {{ calculateProficiency(char.level, spell.proficiency, char.untrainedImprovisation) }}
          </div>
        </div>
      </td>
      <td class="text-center">
        <div class="mx-auto">
          <div class="table_attr">{{ char.attributes[spell.keyAttr] }}</div>
          <Select style="width: 5rem" v-model="spell.keyAttr" :options="keyAttr"
                  optionLabel="key" optionValue="key"
                  placeholder="Key Att"></Select>
        </div>
      </td>
      <td class="">
        <div class=" mx-auto text-center">
          <InputNumber class="number" v-model="spell.item" showButtons
                       buttonLayout="horizontal" fluid
                       :min="0" :max="30">
            <template #incrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiPlus"/>
            </template>
            <template #decrementbuttonicon>
              <MdiIcon size="14pt" icon="mdiMinus"/>
            </template>
          </InputNumber>
        </div>
      </td>
      <td/>
      <td class="text-center">
        {{
        Number(char.attributes[spell.keyAttr]) + Number(spell.item) + calculateProficiency(char.level,
        spell.proficiency, false)
        }}
      </td>
    </tr>

    <tr>
      <td class="text-center flex">
        <InputText class="lore_skill" flex placeholder="New Spell DC" v-model="rNewSpellDC"></InputText>
        <Button outlined class="lore_button" @click="addSpellDC(i)">
          <MdiIcon icon="mdiPlus"/>
        </Button>
      </td>
    </tr>
    </tbody>

  </table>
</template>

<style scoped lang="scss">

.number {
  width: 8rem;
  font-size: 4rem;
  text-align: center;

}


.table_prof_num {
  display: inline-block;
  border: white 1px solid;
  border-radius: 0.5rem;
  width: 2rem;
  height: 2.1rem;
  @apply m-1;
  @apply p-1;
  @apply opacity-50;
  @apply align-middle;
  @apply content-center;
}

.table_attr_type {
  display: inline-block;
  @apply w-6;
  @apply opacity-30;
}

.table_attr {
  display: inline-block;
  width: 2rem;
  text-align: center;
}


.lore_skill {
  @apply table_skill;
  @apply w-40;
  margin-left: auto;
}

.lore_button {
  margin-left: 0.5rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  margin-right: auto;
  padding: 0.5rem;
  line-height: 0.5rem;
}

.table_skill {
  text-align: center;
  font-weight: bold;
}

.editDivider {
  border-top: 0.5pt solid gray;
}

</style>
