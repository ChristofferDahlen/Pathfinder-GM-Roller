<script setup lang="ts">
import {ref} from "vue";
import {DC} from "../../ts/sharedResources";

const simpleDCs = ref([
  { desc: "Untrained",  value: 10 },
  { desc: "Trained",    value: 15 },
  { desc: "Expert",     value: 20 },
  { desc: "Master",     value: 30 },
  { desc: "Legendary",  value: 40 },
])
</script>

<template>
  <div class="flex flex-wrap gap-2 p-1">
    <button
        v-for="dc in simpleDCs" :key="dc.value"
        class="dc-btn"
        @click="DC.set(dc.value, true)">
      <span class="dc-label">{{ dc.desc }}</span>
      <span class="dc-value">{{ dc.value }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.dc-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.6rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--p-primary-color);
}

.dc-value {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--p-primary-color), transparent 80%);
  color: var(--p-primary-color);
}
</style>
