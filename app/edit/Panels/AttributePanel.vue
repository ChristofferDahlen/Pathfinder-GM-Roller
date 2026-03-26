<script setup lang="ts">
import type {iCharacter} from "../../ts/types";
import {attrFullname, Attribute} from "../../ts/types";
import {getPrefix} from "../../ts/rolling";

const char = defineModel<iCharacter>({ required: true });
</script>

<template>
  <Panel toggleable header="Attributes">
    <div class="flex flex-col gap-2 text-sm">
      <div v-for="a in Attribute" :key="'edit_char_attr_' + a" class="flex items-center gap-2">
        <span class="w-24 opacity-70">{{ attrFullname[a] }}</span>
        <InputNumber
            v-model="char.attributes[a]"
            :prefix="getPrefix(char.attributes[a])"
            show-buttons button-layout="horizontal" size="small"
            style="width: 7.5rem" 
            :min="-9" :max="9" fluid>
          <template #incrementbuttonicon><MdiIcon size="12pt" icon="mdiPlus"/></template>
          <template #decrementbuttonicon><MdiIcon size="12pt" icon="mdiMinus"/></template>
        </InputNumber>
      </div>
    </div>
  </Panel>
</template>
