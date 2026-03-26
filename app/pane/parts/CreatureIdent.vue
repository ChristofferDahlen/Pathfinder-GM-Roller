<script setup lang="ts">
import {capitalize, ref} from "vue";
import {Selected} from "../../ts/sharedResources";

const creatureTable = ref({
  "Aberration":  ["occultism"],
  "Animal":      ["nature"],
  "Astral":      ["occultism"],
  "Beast":       ["arcana", "nature"],
  "Celestial":   ["religion"],
  "Construct":   ["arcana", "crafting"],
  "Dragon":      ["arcana"],
  "Dream":       ["occultism"],
  "Elemental":   ["arcana", "nature"],
  "Ethereal":    ["occultism"],
  "Fey":         ["nature"],
  "Fiend":       ["religion"],
  "Fungus":      ["nature"],
  "Humanoid":    ["society"],
  "Monitor":     ["religion"],
  "Ooze":        ["occultism"],
  "Plant":       ["nature"],
  "Shade":       ["religion"],
  "Spirit":      ["occultism"],
  "Time":        ["occultism"],
  "Undead":      ["religion"],
})
</script>

<template>
  <div class="creature-list p-1">
    <div
        v-for="(skills, trait) in creatureTable" :key="trait"
        class="creature-row"
        @click="Selected.selectSkills(skills)">
      <span class="trait-name">{{ trait }}</span>
      <div class="skill-chips">
        <span v-for="skill in skills" :key="skill" class="skill-chip">
          {{ capitalize(skill) }}
        </span>
      </div>
      <MdiIcon icon="mdiChevronRight" class="row-icon" size="14pt"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.creature-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.creature-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: color-mix(in srgb, var(--p-primary-color), transparent 88%);
    border-color: var(--p-primary-color);
  }
}

.trait-name {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 6rem;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  flex: 1;
}

.skill-chip {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--p-primary-color), transparent 82%);
  color: var(--p-primary-color);
  font-weight: 500;
}

.row-icon {
  opacity: 0.3;
  flex-shrink: 0;
}
</style>
