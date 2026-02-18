<script setup lang="ts">
import Tab from "primevue/tab";
import TabList from "primevue/tablist";
import TabPanels from "primevue/tabpanels";
import {RollerShortcuts} from "./ts/settings";
</script>


<template>
  <Tabs value="1" class="overflow-clip">

    <TabList class="tabs">
      <Tab value="0">Main</Tab>
      <Tab value="1">Shortcuts</Tab>
    </TabList>
    <TabPanels class="overflow-clip">
      <TabPanel value="0">

        aaa
      </TabPanel>
      <TabPanel value="1" class="">

        <Accordion multiple >
          <AccordionPanel v-for="(shorts, group, i) in RollerShortcuts" :value="i" class="w-72" >
            <AccordionHeader class="m-2 p-2 w-72">
              {{group}}
            </AccordionHeader>
            <AccordionContent>
              <div v-for="(a,b) in shorts" class="flex justify-between">
                <div class="inline-block align-baseline ">{{b}}</div>
                <Button class="inline-block">{{a}} </Button>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
        bbb
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
