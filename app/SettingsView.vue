<script setup lang="ts">
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import {OrganizedSettings, OrganizedShortCuts, RollerShortcuts, ShowArmorClass} from "./ts/settings";

function change() {
  console.log(OrganizedSettings)
}


</script>


<template>
  <Tabs value="1" class="overflow-clip">

    <TabList class="tabs">
      <Tab value="0">Main</Tab>
      <Tab value="1">Shortcuts</Tab>
    </TabList>
    <TabPanels class="overflow-clip">
      <TabPanel value="0">
        <Accordion multiple >
          <AccordionPanel v-for="(shorts, group, i) in OrganizedSettings" :value="i" class="w-72" >
            <AccordionHeader class="m-2 p-2 w-72">
              {{group}}
            </AccordionHeader>
            <AccordionContent>
              <div v-for="(object, key) in shorts" class="flex justify-between">
                <div class="inline-block align-baseline ">{{object.name}}</div>
                <Checkbox v-model="object.state" @valueChange="change" binary />
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </TabPanel>
      <TabPanel value="1" class="">

        <Accordion multiple >
          <AccordionPanel v-for="(shorts, group, i) in OrganizedShortCuts" :value="i" class="w-72" >
            <AccordionHeader class="m-2 p-2 w-72">
              {{group}}
            </AccordionHeader>
            <AccordionContent>
              <div v-for="(a) in shorts" class="flex justify-between">
                <div class="inline-block align-baseline ">{{a}}</div>
                <Button class="inline-block pt-1 pb-1" outlined>{{RollerShortcuts[a]}} </Button>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
