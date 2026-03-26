<script setup lang="ts">
import c from "../../assets/dc_by_lvl.json"
import d from "../../assets/dc_by_spell_rank.json"
import {DC} from "../../ts/sharedResources"

const dc_by_level = ref(c)
const dc_by_spell_rank = ref(d)
</script>

<template>
  <div class="p-1 flex flex-col gap-3">

    <div>
      <div class="section-label">By Level</div>
      <div class="dc-grid">
        <button
            v-for="dc in dc_by_level" :key="dc.level"
            class="dc-btn"
            @click="DC.set(dc.dc, true)">
          <span class="dc-label">{{ dc.level }}</span>
          <span class="dc-value">{{ dc.dc }}</span>
        </button>
      </div>
    </div>

    <div>
      <div class="section-label">By Spell Rank</div>
      <div class="dc-grid">
        <button
            v-for="dc in dc_by_spell_rank" :key="dc.level"
            class="dc-btn"
            @click="DC.set(dc.dc, true)">
          <span class="dc-label">{{ dc.level }}</span>
          <span class="dc-value">{{ dc.dc }}</span>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.section-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  margin-bottom: 0.4rem;
}

.dc-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.dc-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--p-primary-color);
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: color-mix(in srgb, var(--p-primary-color), transparent 85%);
  }

  &:active {
    background: color-mix(in srgb, var(--p-primary-color), transparent 70%);
  }
}

.dc-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--p-primary-color);
  min-width: 1.2rem;
  text-align: center;
}

.dc-value {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--p-primary-color), transparent 80%);
  color: var(--p-primary-color);
}
</style>
