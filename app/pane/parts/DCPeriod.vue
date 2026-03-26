<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch} from "vue";
import {Roller} from "../../ts/sharedResources";

const isRolling = ref(false);
const rollMins = ref(5);
const rollSec = ref(0);
const timeout = ref();

onMounted(() => {
  const storedSec = localStorage.getItem("auto-roll-sec");
  const storedMin = localStorage.getItem("auto-roll-min");
  const storedRolling = localStorage.getItem("auto-roll");

  if (storedSec) rollSec.value = Number(storedSec);
  if (storedMin) rollMins.value = Number(storedMin);
  if (storedRolling) isRolling.value = storedRolling === 'true';

  if (isRolling.value) timeout.value = setTimeout(roll, getTime());
});

onUnmounted(() => save());

function getTime() {
  return Math.max(1000 * rollSec.value + 60000 * rollMins.value, 1000);
}

function roll() {
  if (isRolling.value) {
    timeout.value = setTimeout(roll, getTime());
    Roller.rollAll();
  } else {
    clearTimeout(timeout.value);
  }
}

function save() {
  localStorage.setItem("auto-roll", isRolling.value.toString());
  localStorage.setItem("auto-roll-sec", rollSec.value.toString());
  localStorage.setItem("auto-roll-min", rollMins.value.toString());
}

function change() {
  if (isRolling.value) {
    timeout.value = setTimeout(roll, getTime());
  } else {
    clearTimeout(timeout.value);
  }
  save();
}

function restart() {
  if (isRolling.value) {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(roll, getTime());
  }
  save();
}

watch(rollSec, restart);
watch(rollMins, restart);
</script>

<template>
  <div class="auto-roll p-2">
    <div class="toggle-row">
      <Checkbox v-model="isRolling" binary @change="change"/>
      <span class="toggle-label">{{ isRolling ? 'Rolling automatically' : 'Auto roll disabled' }}</span>
      <span v-if="isRolling" class="status-dot"/>
    </div>

    <div class="interval-row">
      <span class="interval-label">Every</span>
      <div class="interval-input">
        <input v-model.number="rollMins" type="number" min="0" class="time-input" @change="restart"/>
        <span class="time-unit">min</span>
      </div>
      <div class="interval-input">
        <input v-model.number="rollSec" type="number" min="0" max="59" class="time-input" @change="restart"/>
        <span class="time-unit">sec</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auto-roll {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-label {
  font-size: 0.85rem;
  font-weight: 500;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--p-primary-color);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.interval-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.interval-label {
  font-size: 0.8rem;
  opacity: 0.6;
}

.interval-input {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid var(--p-primary-color);
  border-radius: 0.375rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--p-primary-color), transparent 90%);
}

.time-input {
  width: 2.5rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.3rem 0.25rem;
  background: transparent;
  border: none;
  outline: none;
  color: var(--p-primary-color);

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; }
}

.time-unit {
  font-size: 0.7rem;
  opacity: 0.6;
  padding-right: 0.4rem;
}
</style>
