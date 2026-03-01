<script setup lang="ts">
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import {OrganizedSettings, OrganizedShortCuts, RollerShortcuts, type shortcutsEnum} from "./ts/settings";
import {watch} from "vue";

function change() {
  console.log(OrganizedSettings)
}


const defenses = ref<number[]>([0, 1,2,3])
const shortcutGroups = ref<number[]>([0, 1,2,3])
const visible = ref<boolean>(false);
const editingShortcut = ref<shortcutsEnum>();
const shortcutToAdd = ref<string>();

const confirm = useConfirm();

/*
function UpdateShortcuts(a: shortcutsEnum) {


  window.addEventListener("keydown", (event) => {
    if(event.key == "Control" || event.key == "Shift" || event.key=="Alt")
    {
      UpdateShortcuts(a);
      return;
    }

    const keyCombination = `${event.ctrlKey ? "Ctrl+" : ""}${event.altKey ? "Alt+" : ""}${event.shiftKey ? "Shift+" : ""}${event.code}`;
    if(Object.values(RollerShortcuts).includes(keyCombination))
    {
      console.error(`Error: Shortcut "${keyCombination}" is already in use.`);
      return;
    }


      RollerShortcuts[a] = keyCombination;
    console.log(`Shortcut for ${a} updated to:`, keyCombination);
  }, {once: true});
}
*/


const RESERVED_KEYS = ["F5", "Ctrl+R", "Ctrl+Tab", "Alt+Tab"];
const normalizeKey = (key: string) => {
  switch (key) {
    case " ": return "Space";
    case "Enter": return "Enter";
    case "Backspace": return "Backspace";
    case "Control": return "Ctrl";
    default: return key;
  }
};

const handler = (event: KeyboardEvent) => {
  let keyCombination = ""
  if(event.key === "Control" || event.key === "Alt" || event.key === "Shift")
    keyCombination = normalizeKey(event.key);
  else
    keyCombination = `${event.ctrlKey ? "Ctrl+" : ""}${event.altKey ? "Alt+" : ""}${event.shiftKey ? "Shift+" : ""}${normalizeKey(event.key)}`;

  if (RESERVED_KEYS.includes(keyCombination)) {
    console.error(`Error: Shortcut "${keyCombination}" is reserved.`);
    return;
  }

  shortcutToAdd.value = keyCombination

  event.preventDefault();
};

function UpdateShortcuts(a: shortcutsEnum) {
  console.log("Opening Shortcut change")
  visible.value = true
  editingShortcut.value = a.toString();
  shortcutToAdd.value = RollerShortcuts.value[a]
}

watch(visible, (newVal) => {
  if(newVal)
    addEventListener('keydown', handler)
  else {
    removeEventListener('keydown',handler)
    shortcutToAdd.value = ""
  }
})


function SaveShortcut() {
  console.log("Setting Shortcut")

  for(const key in RollerShortcuts.value) {
    if(key == editingShortcut.value)
      continue

    if(RollerShortcuts.value[key] === shortcutToAdd.value)
      RollerShortcuts.value[key] = "..."
  }

  RollerShortcuts.value[editingShortcut.value] = shortcutToAdd.value;
  console.log("Setting Shortcut", editingShortcut.value, " to ",  shortcutToAdd.value, " in ", RollerShortcuts)

  visible.value = false
}

const warningText = computed(()=> {
  let overrides = ""
  for(const key in RollerShortcuts.value) {
    if(key == editingShortcut.value)
      continue

    if(RollerShortcuts.value[key] === shortcutToAdd.value)
      overrides = key
  }
  if(!overrides)
    return ""

  return  "Shortcut overrides " + overrides;
},)

</script>


<template>
  <Dialog v-model:visible="visible" modal header="Update Shortcut" class="save">

    <div class="ml-2">{{editingShortcut}}</div>

    <InputText v-model="shortcutToAdd" class="min-w-36 w-44"/>
    <Button icon="plus" @click="SaveShortcut()" :disabled="shortcutToAdd === ''">          <MdiIcon icon="mdiPlus"/></Button>
    <div v-if="warningText"><MdiIcon icon='mdiAlert' class="inline-block align-middle size-4 text-orange-500"/><div class="inline-block" >{{ warningText }}</div></div>

  </Dialog>
  <Tabs value="0" class="overflow-clip">
    <TabList class="tabs">
      <Tab value="0">Main</Tab>
      <Tab value="1">Shortcuts</Tab>
    </TabList>
    <TabPanels class="overflow-clip">
      <TabPanel value="0">
        <Accordion multiple :value="defenses">
          <AccordionPanel v-for="(shorts, group, i) in OrganizedSettings" :value="i" class="w-72" >
            <AccordionHeader class="m-2 p-2 w-72">
              {{group}}
            </AccordionHeader>
            <AccordionContent>
              <div v-for="(object) in shorts" class="flex justify-between">
                <div class="inline-block align-baseline ">{{object.name}}</div>
                <Checkbox v-model="object.state" @valueChange="change" binary />
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </TabPanel>
      <TabPanel value="1" class="">

        <Accordion multiple :value="shortcutGroups">
          <AccordionPanel v-for="(shorts, group, i) in OrganizedShortCuts" :value="i" class="w-72" >
            <AccordionHeader class="m-2 p-2 w-72">
              {{group}}
            </AccordionHeader>
            <AccordionContent>
              <div v-for="(a) in shorts" class="flex justify-between">
                <div class="inline-block align-baseline ">{{a}}</div>
                <Button class="inline-block pt-1 pb-1" outlined @click="UpdateShortcuts(a)">{{RollerShortcuts[a]}} </Button>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped>

.p-dialog-title { font-size: 4rem; color: #333; }



</style>
