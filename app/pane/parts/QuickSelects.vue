<script setup lang="ts">
import {capitalize} from "vue";
import {Skills} from "../../ts/types";
import {type selectable, Selected} from "../../ts/sharedResources";

interface sklist { trait: string; skills: Array<selectable | 'lore'> }

const quickSelects: Array<sklist> = [
  { trait: "Magic",     skills: [Skills.arcana, Skills.nature, Skills.occultism, Skills.religion] },
  { trait: "Social",    skills: [Skills.deception, Skills.diplomacy, Skills.intimidation, Skills.performance] },
  { trait: "Stealth",   skills: [Skills.stealth, Skills.thievery] },
  { trait: "Physical",  skills: [Skills.acrobatics, Skills.athletics, Skills.thievery] },
  { trait: "Survival",  skills: [Skills.medicine, Skills.survival] },
  { trait: "Knowledge", skills: [Skills.arcana, Skills.crafting, Skills.medicine, Skills.nature, Skills.occultism, Skills.religion, Skills.society, Skills.survival, "lore"] },
]
</script>

<template>
  <div class="quick-list p-1">
    <div
        v-for="entry in quickSelects" :key="entry.trait"
        class="quick-row"
        @click="Selected.selectSkills(entry.skills)">
      <span class="category-name">{{ entry.trait }}</span>
      <div class="skill-chips">
        <span v-for="skill in entry.skills" :key="skill" class="skill-chip">
          {{ capitalize(skill) }}
        </span>
      </div>
      <MdiIcon icon="mdiChevronRight" class="row-icon" size="14pt"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quick-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.quick-row {
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

.category-name {
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 5rem;
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
