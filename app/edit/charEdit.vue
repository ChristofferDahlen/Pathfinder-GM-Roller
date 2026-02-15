<script setup lang="ts">


import {capitalize, ref} from "vue";
import type {iCharacters} from "../ts/types";
import {
  attEnum,
  attrBase,
  attrFullname,
  type belowBorder,
  type iDC,
  type iLore,
  newCharacter,
  proficiencyEnum,
  skillEnum
} from "../ts/types";

import {type iPBChar, loadFromPB, updateCharatcer} from "../ts/pb";

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import SelectButton from 'primevue/selectbutton';
import Checkbox from "primevue/checkbox";
import ScrollPanel from "primevue/scrollpanel";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import {calculateBonus, calculateBonusFromInfo, calculateProficiency, getPrefix} from "../ts/rolling";

const characters = defineModel<iCharacters>({required: true, default : [newCharacter(0)] });

const border = ref<belowBorder>()




const proficiencyOptions = ref([
{value:proficiencyEnum.T, name:"T"},
{value:proficiencyEnum.E, name:"E"},
{value:proficiencyEnum.M, name:"M"},
{value:proficiencyEnum.L, name:"L"},
] )

const rLoading = ref<boolean>(false)


const rNewLore = ref<string>("")
const rNewSpellDC = ref<string>("")

const newResistance = ref("")
const newResistanceValue = ref(0)

const newVulnerability = ref("")
const newVulnerabilityValue = ref(0)


const rHoverVal = ref<number>(-2)
const rHoverDragged = ref<number>(-2)

const selectedTab = ref<number>(0)
const pathbuilderText = ref<string>("")
const pathbuilderID = ref<string>("")

const keyAttr = ref([
  {key : attEnum.str, name : "str"},
  {key : attEnum.con, name : "con"},
  {key : attEnum.dex, name : "dex"},
  {key : attEnum.int, name : "int"},
  {key : attEnum.wis, name : "wis"},
  {key : attEnum.cha, name : "cha"},
])




function updateFromPB() {
  function updateUsingPB(i : number, Pb_json : iPBChar) {
    if(characters.value === undefined) {
      characters.value = []
      return
    }
    if(i in characters.value){
      characters.value[i] = updateCharatcer(characters.value[i] ?? newCharacter(i), Pb_json);
    }
  }


  const i = selectedTab.value;

  let Pb_json = null;
  if (pathbuilderID.value !== "") {
    const Pb = loadFromPB(pathbuilderID.value);
    Pb.then((Pb_json) => {
      updateUsingPB(i, Pb_json)
    })
  } else {
    const Pb_text = pathbuilderText.value
    Pb_json = JSON.parse(Pb_text)

    updateUsingPB(i, Pb_json)
  }
}


function addCharacter() {
  characters.value.push(newCharacter(characters.value.length))
  selectedTab.value = characters.value.length - 1;
}

function removeCharacter() {

  console.log("Deleting char")
  characters.value.splice(selectedTab.value, 1);
  if (selectedTab.value > 0) {
    selectedTab.value--;
  }

  if (characters.value.length == 0)
    addCharacter();
}


interface myDragEventTarget extends EventTarget {
  id : number | string,
  clientWidth : number,
  parentElement? : myDragEventTarget
}




interface myDragEvent extends DragEvent{
  target : myDragEventTarget

}




function onDrag(event : DragEvent) {
  const u = event as myDragEvent

  if(u.target === null || u.dataTransfer === null)
    return


  console.info("Start Drag", u.target, u.target.id)
  rHoverDragged.value = u.target.id as number;
  u.dataTransfer.effectAllowed = 'move';
  u.dataTransfer.dropEffect = 'move';

}

function dragEnd(event : DragEvent) {
  const u = event as myDragEvent

  if(u.target === null)
    return

  console.info("Stop Drag", u.target, u.target.id, rHoverDragged.value, rHoverVal.value)
  const target = rHoverVal.value - Number(rHoverVal.value > rHoverDragged.value)

  var el = characters.value[rHoverDragged.value];
  if(el != undefined) {
    characters.value.splice(rHoverDragged.value, 1);
    characters.value.splice(target, 0, el);
  }

  rHoverVal.value = -1;
  rHoverDragged.value = -1;
}

function onDrop(event: DragEvent) {
  const u = event as myDragEvent

  if(u.dataTransfer === null)
    return

  u.dataTransfer.effectAllowed = 'move';

  var target : myDragEventTarget | undefined  = u.target;
  if (u.target.id == "icon") {
    target = target.parentElement;
  }

  if(target === undefined)
    return

  const center = target.clientWidth / 2;
  const left = u.layerX < center;
  const id = Number(target.id);

  if (left) {
    rHoverVal.value = id;
  } else {
    rHoverVal.value = id + 1;
  }
}

function addResistance(iChar: number) {
  characters.value[iChar]?.resistances.push({name: newResistance.value, value: newResistanceValue.value})
  newResistance.value = ""
  newResistanceValue.value = 0
}

function removeResistance(iChar: number, iRes: number) {
  characters.value[iChar]?.resistances.splice(iRes, 1);
}

function addVulnerability(iChar: number) {
  characters.value[iChar]?.vulnerabilities.push({name: newVulnerability.value, value: newVulnerabilityValue.value})
  newVulnerability.value = ""
  newVulnerabilityValue.value = 0
}

function removeVulnerability(iChar: number, iRes: number) {
  console.warn(characters)
  characters.value[iChar]?.vulnerabilities.splice(iRes, 1);
}


function addLore(iChar: number) {
  characters.value[iChar]?.lores.push({name: capitalize(rNewLore.value), proficiency: proficiencyEnum.U, item: 0})
  characters.value[iChar]?.lores.sort(function (a : iLore, b : iLore) {
    return capitalize(a.name) > capitalize(b.name) ? 1 : -1;
  })

  rNewLore.value = ''
}

function addSpellDC(iChar: number) {
  if (rNewSpellDC.value === '')
    return

  characters.value[iChar]?.spellDCs.push({
    name: capitalize(rNewSpellDC.value),
    keyAttr: characters.value[iChar].keyAbility,
    proficiency: proficiencyEnum.U,
    item: 0,
    type: "spell"
  })

  characters.value[iChar]?.spellDCs.sort(function (a : iDC, b : iDC) {
    return capitalize(a.name) > capitalize(b.name) ? 1 : -1;
  })


  rNewSpellDC.value = ''
}

function removeLore(iChar: number, iLore: number) {
  characters.value[iChar]?.lores.splice(iLore, 1);
}

function removeSpellDC(iChar: number, iLore: number) {
  characters.value[iChar]?.spellDCs.splice(iLore, 1);
}

</script>


<template>
  <Dialog v-model:visible="rLoading" modal class="z-10 w-1/2" header="Update from Pathbuilder Json">
    <span class="text-surface-500 dark:text-surface-400 block">Input the ID.</span>
    <InputText v-model="pathbuilderID"></InputText>
    <span class="text-surface-500 dark:text-surface-400 block">
              or Paste the Json data for the character.</span>
    <Textarea v-model="pathbuilderText" class="w-full"></Textarea>
    <div>Note: Following fields aren't updated: Check penalty, Item bonuses & player name</div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="rLoading = false"></Button>
      <Button type="button" label="Update" @click="rLoading = false; updateFromPB()"></Button>
    </div>
  </Dialog>


  <Tabs scrollable lazy v-model:value="selectedTab" class="overflow-clip">
    <TabList class="tabs">
      <Tab v-for="(char, i) in characters" :key="'edit_char_sel_' + i"
           :id="i"
           :value="i">
        <div class="p-2 hover" :id="String(i)" :class="{
            ['hoverL']: i == 0 && rHoverVal == 0,
            ['hoverR']: i + 1 == rHoverVal}"
             draggable="true"
             @dragend="u=>dragEnd(u)"
             @ondrop="(u : DragEvent)=>onDrop(u)"
             @dragover="u=>onDrop(u)"
             @dragstart="u=>onDrag(u)"
        >

          <mdi-icon @dragover.prevent class="inline-block" :class="{'dragged':i==rHoverDragged}" icon="mdiViewColumn"
                    id="icon"/>
          <span @dragover.prevent id="icon" class="pl-1"
                :class="{'dragged':i==rHoverDragged || char.name == ''}">{{
              char.name == '' ? 'New' : char.name
            }}</span>
        </div>
      </Tab>
      <Button outlined class="p-0 ml-2 mt-auto mb-auto" size="small" @click="addCharacter">
        <MdiIcon icon="mdiPlus"/>
      </Button>

    </TabList>

    <TabPanels class="overflow-clip">
      <TabPanel v-for="(char, i) in characters" :value="i" class="h-full overflow-clip" :key="'edit_char_' + i">
        <scroll-panel class="inline-block align-top" style=" height: 70vh; width: 35%">
          <div class="inline-block w-7/12 ">
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
            <Panel toggleable header="Attributes" class="">
              <div v-for="a in attEnum" class="grid grid-cols-2 w-fit" :key="'edit_char_' + i + '_attr_' + a">
                <span class="inline-block p-2">{{ attrFullname[a] }}</span>
                <InputNumber class="number" v-model="char.attributes[a]"
                             :prefix="getPrefix(char.attributes[a])" showButtons buttonLayout="horizontal" fluid
                             :min="-9" :max="9">
                  <template #incrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiPlus"/>
                  </template>
                  <template #decrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiMinus"/>
                  </template>
                </InputNumber>
              </div>
            </Panel>
          </div>
          <div class="inline-block align-top w-5/12">
            <Panel toggleable header="Other" class="">
              <div class="pl-2">
                <Button class="mr-2" @click="rLoading = true;">Load from<br>Pathbuilder</Button>
                <Button class="" @click="removeCharacter">Delete<br> Character</Button>

              </div>
            </Panel>
            <Panel toggleable header="Defense">
              <div class="">
                <span class="inline-block p-2 w-16">AC</span>
                <InputNumber class="number" v-model="char.protection.ac" showButtons
                             buttonLayout="horizontal" fluid :min="0" :max="30">
                  <template #incrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiPlus"/>
                  </template>
                  <template #decrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiMinus"/>
                  </template>
                </InputNumber>
              </div>
              <div class="">
                <span class="inline-block p-2 w-16">Shield</span>
                <InputNumber class="number" v-model="char.protection.shield" showButtons
                             buttonLayout="horizontal" fluid :min="0" :max="30">
                  <template #incrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiPlus"/>
                  </template>
                  <template #decrementbuttonicon>
                    <MdiIcon size="14pt" icon="mdiMinus"/>
                  </template>
                </InputNumber>
              </div>
            </Panel>
            <Panel toggleable header="Resistances" class="overflow-scroll">
              <ul>
                <li v-for="(res, ir) in char.resistances" class="p-1" :key="'res_' + ir">
                  <InputText v-model="res.name" placeholder="Type" pt:root:class="pt_rv_text"
                             class="rv_text"></InputText>
                  <InputNumber class="rv_field " v-model="res.value" fluid
                               :min="0" :max="30">
                  </InputNumber>
                  <Button class="rv_button" @click="removeResistance(i, ir)">
                    <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"></MdiIcon>
                  </Button>
                </li>
                <li class="p-1">
                  <InputText v-model="newResistance" placeholder="Type" pt:root:class="pt_rv_text"
                             class="rv_text"></InputText>
                  <InputNumber class="rv_field " v-model="newResistanceValue" fluid
                               :min="0" :max="30">
                  </InputNumber>
                  <Button class="rv_button" @click="addResistance(i)">
                    <MdiIcon icon="mdiPlus" size="12pt" class="p-0 m-0"></MdiIcon>
                  </Button>
                </li>
              </ul>
            </Panel>
            <Panel toggleable header="Vulnerabilities" class="overflow-scroll">
              <ul>
                <li v-for="(vul, ir) in char.vulnerabilities" class="p-1" :key="'vul_' + ir">
                  <InputText v-model="vul.name" placeholder="Type" pt:root:class="pt_rv_text"
                             class="rv_text"></InputText>
                  <InputNumber class="rv_field " v-model="vul.value" fluid
                               :min="0" :max="30">
                  </InputNumber>
                  <Button class="rv_button" @click="removeVulnerability(i, ir)">
                    <MdiIcon icon="mdiMinus" size="12pt" class="p-0 m-0"></MdiIcon>
                  </Button>
                </li>
                <li class="p-1">
                  <InputText v-model="newVulnerability" placeholder="Type" pt:root:class="pt_rv_text"
                             class="rv_text"></InputText>
                  <InputNumber class="rv_field text-center " v-model="newVulnerabilityValue" fluid
                               :min="0" :max="30">
                  </InputNumber>
                  <Button class="rv_button" @click="addVulnerability(i)">
                    <MdiIcon icon="mdiPlus" size="12pt" class="p-0 m-0"></MdiIcon>
                  </Button>
                </li>
              </ul>
            </Panel>
          </div>
        </scroll-panel>
        <ScrollPanel class="inline-block align-top" style=" height: 70vh; width: 65%">
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


            <tr v-for="skill in skillEnum" :key="'edit_' + skill" :class="{ editDivider : false }">
              <td class="table_skill">{{ capitalize(skill.toString())  }}</td>
              <td class="text-center">
                <div class="mx-auto">
                  <SelectButton v-model="char.proficiencies[skill]"
                                :options="proficiencyOptions"
                                option-label="name"
                                optionValue="value"
                                @update:modelValue="(v) => {
                                  if(v === undefined || v === null)
                                    char.proficiencies[skill] = proficiencyEnum.U
                                }"
                                :defaultValue="proficiencyEnum.U"
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
              <td v-if="(attrBase[skill] === attEnum.str || attrBase[skill] === attEnum.dex)" class="text-center">
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
                  Number(char.attributes['int']) + Number(lore.item) + calculateProficiency(char.level, lore.proficiency, char.untrainedImprovisation)
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
                  Number(char.attributes[char.keyAbility]) + Number(char.item.classDC) + calculateProficiency(char.level, char.proficiencies.classDC, false)
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
                                  if(!(val in proficiencyEnum)){
                                    spell.proficiency = proficiencyEnum.U;
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
                  Number(char.attributes[spell.keyAttr]) + Number(spell.item) + calculateProficiency(char.level, spell.proficiency, false)
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

        </ScrollPanel>
      </TabPanel>
    </TabPanels>

  </Tabs>

</template>

<style scoped lang="scss">

.tabs {
  .p-tab {
    margin: 0;
    padding: 0;
  }

  .hoverL {
    @apply border-l-2;
    @apply border-double;
    @apply border-surface-700;
  }

  .hoverR {
    @apply border-r-2;
    @apply border-double;
    @apply border-surface-700;
  }


  .dragged {
    @apply opacity-20;
  }
}

.number {
  width: 8rem;
  font-size: 4rem;
  text-align: center;

  .p-inputnumber-button {
    padding: 0;
    margin: 0;
  }

  .p-input-text {
    flex: 8 8 auto;
    text-align: center;
    color: orange;
    justify-content: center;
    margin: 2pt;
  }
}

.pt_rv_text {
  font-size: small;
  @apply align-middle;

  padding: 0;
}

.rv_text {
  width: 40%;
  height: 1.75rem;
  margin: 0.1rem;

  @apply align-middle;
  text-align: center;
  padding: 0;
}

.rv_field {
  height: 1.75rem;
  width: 20%;
  margin: 0.1rem;

  .p-inputnumber {
    text-align: center;
  }

  @apply align-middle;

}

.rv_button {
  height: 1.5rem;
  @apply align-middle;
  margin: 0.1rem;

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


.table_total {

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
