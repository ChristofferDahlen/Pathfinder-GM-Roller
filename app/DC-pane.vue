<template>
  <div class="">
    <div class="card">
    <DCHead v-model="dc" :old-value="oldDc" @update="reset" @reset="setOldDc"></DCHead>
</div>

    <Accordion :value="tiles" multiple  >
      <AccordionPanel value="1">
        <AccordionHeader >Simple DC</AccordionHeader>
        <AccordionContent>
          <SimpleDC @set="(val, saveOld) => set(val, saveOld)"></SimpleDC>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>Level Based DCs</AccordionHeader>
        <AccordionContent>
          <DCByLevel @set="(val, saveOld) => set(val, saveOld)"></DCByLevel>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="0">
        <AccordionHeader>Saved DCs</AccordionHeader>
        <AccordionContent>
          <DCSaved :dc="dc" @set="(val: number , saveOld: boolean ) => set(val, saveOld)"></DCSaved>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="4">
        <AccordionHeader>Creature Identification</AccordionHeader>
        <AccordionContent>
          <CreatureIdent @skillSelect="u=>emit('skillSelect', u)"></CreatureIdent>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="5">
        <AccordionHeader>Quick Selects</AccordionHeader>
        <AccordionContent>
          <QuickSelects @skillSelect="u=>emit('skillSelect', u)"></QuickSelects>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="3">
        <AccordionHeader>Auto Roll</AccordionHeader>
        <AccordionContent>
          <DCPeriod @roll="roll" ref="period"></DCPeriod>
        </AccordionContent>
      </AccordionPanel>


    </Accordion>

  </div>


</template>

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref} from 'vue';
import SimpleDC from "./pane/SimpleDC.vue";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DCPeriod from "./pane/DCPeriod.vue";
import CreatureIdent from "./pane/CreatureIdent.vue";
import QuickSelects from "./pane/QuickSelects.vue";
import type {RollerShortcuts} from "ts/settings.ts";
import DCHead from "./pane/DCHead.vue";
import DCByLevel from "./pane/DCByLevel.vue";
import DCSaved from "./pane/DCSaved.vue";

const period = ref()

const tiles = ref(['0'])


</script>

<style scoped lang="scss">
@use "assets/styles/dc-pane.scss" as *;


</style>
