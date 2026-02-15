<template>
  <div class="">
    <div class="card">
      <DCHead />
    </div>

    <Accordion :value="tiles" multiple  >
      <AccordionPanel value="1">
        <AccordionHeader >Simple DC</AccordionHeader>
        <AccordionContent>
          <SimpleDC/>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>Level Based DCs</AccordionHeader>
        <AccordionContent>
          <DCByLevel/>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="0">
        <AccordionHeader>Saved DCs</AccordionHeader>
        <AccordionContent>
          <DCSaved/>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="4">
        <AccordionHeader>Creature Identification</AccordionHeader>
        <AccordionContent>
          <CreatureIdent/>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="5">
        <AccordionHeader>Quick Selects</AccordionHeader>
        <AccordionContent>
          <QuickSelects/>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="3">
        <AccordionHeader>Auto Roll</AccordionHeader>
        <AccordionContent>
          <DCPeriod ref="period" @roll="emit('roll')"></DCPeriod>
        </AccordionContent>
      </AccordionPanel>


    </Accordion>

  </div>


</template>

<script setup lang="ts">
import SimpleDC from "./parts/SimpleDC.vue";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DCPeriod from "./parts/DCPeriod.vue";
import CreatureIdent from "./parts/CreatureIdent.vue";
import QuickSelects from "./parts/QuickSelects.vue";
import DCHead from "./DCHead.vue";
import DCByLevel from "./parts/DCByLevel.vue";
import DCSaved from "./parts/DCSaved.vue";

const tiles = ref(['0'])

const emit = defineEmits(["roll"])

</script>

<style scoped lang="scss">
@use "../assets/styles/dc-pane" as *;


</style>
