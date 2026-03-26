<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {DC} from "../../ts/sharedResources"
import {onShortcutKey, shortcutsEnum} from "../../ts/settings"

const minDC = 0;
const maxDC = 60;

type savedDC = { val: number; strVal: string; header: string }

const DEFAULT_DC = 15;

function makeDefaultSlots(): savedDC[] {
  return Array.from({ length: 6 }, (_, i) => ({
    val: DEFAULT_DC, strVal: String(DEFAULT_DC), header: `Slot ${i + 1}`,
  }));
}

const saved_dcs = ref<savedDC[]>(makeDefaultSlots());

function selectAll(event: FocusEvent | KeyboardEvent) {
  (event.target as HTMLInputElement)?.select();
}

const checkDigit = (event: KeyboardEvent, index: number) => {
  if (event.key !== "Enter") {
    if (event.key.length === 1 && isNaN(Number(event.key)) || event.key.indexOf(' ') >= 0)
      event.preventDefault();
  } else {
    const target = saved_dcs.value[index]
    if (target) update(target);
    selectAll(event);
    event.preventDefault();
  }
};

function updateText(dc: savedDC) {
  dc.strVal = dc.val.toString();
  SaveToStorage();
}

function update(dc: savedDC) {
  let val = parseInt(dc.strVal);
  if (isNaN(val)) val = minDC;
  val = Math.min(Math.max(val, minDC), maxDC);
  dc.val = val;
  updateText(dc);
}

function save(i: number) {
  const dc = saved_dcs.value[i]; if (!dc) return;
  dc.val = DC.value; updateText(dc);
}

function set(i: number) {
  const dc = saved_dcs.value[i]; if (!dc) return;
  DC.set(dc.val, true);
}

function swap(i: number) {
  const dc = saved_dcs.value[i]; if (!dc) return;
  const tmp = DC.value; DC.set(dc.val, true); dc.val = tmp; updateText(dc);
}

function SaveToStorage() {
  localStorage.setItem("savedDCs", JSON.stringify(saved_dcs.value));
}

onMounted(() => {
  try {
    const stored = localStorage.getItem("savedDCs");
    saved_dcs.value = stored ? JSON.parse(stored) : makeDefaultSlots();
  } catch { saved_dcs.value = makeDefaultSlots(); }
});

onUnmounted(() => SaveToStorage());

const setKeys: Partial<Record<shortcutsEnum, number>> = {
  [shortcutsEnum.setSlot1]: 0, [shortcutsEnum.setSlot2]: 1,
  [shortcutsEnum.setSlot3]: 2, [shortcutsEnum.setSlot4]: 3,
  [shortcutsEnum.setSlot5]: 4, [shortcutsEnum.setSlot6]: 5,
}
onShortcutKey([shortcutsEnum.setSlot1, shortcutsEnum.setSlot2, shortcutsEnum.setSlot3,
  shortcutsEnum.setSlot4, shortcutsEnum.setSlot5, shortcutsEnum.setSlot6],
  (k) => { const idx = setKeys[k]; if (idx !== undefined) set(idx); });

const swapKeys: Partial<Record<shortcutsEnum, number>> = {
  [shortcutsEnum.swapSlot1]: 0, [shortcutsEnum.swapSlot2]: 1,
  [shortcutsEnum.swapSlot3]: 2, [shortcutsEnum.swapSlot4]: 3,
  [shortcutsEnum.swapSlot5]: 4, [shortcutsEnum.swapSlot6]: 5,
}
onShortcutKey([shortcutsEnum.swapSlot1, shortcutsEnum.swapSlot2, shortcutsEnum.swapSlot3,
  shortcutsEnum.swapSlot4, shortcutsEnum.swapSlot5, shortcutsEnum.swapSlot6],
  (k) => { const idx = swapKeys[k]; if (idx !== undefined) swap(idx); });
</script>

<template>
  <div class="saved-grid p-1">
    <div v-for="(dc, i) in saved_dcs" :key="i" class="slot">
      <input
          v-model="dc.header"
          class="slot-label"
          @focusout="SaveToStorage"/>
      <div class="slot-body">
        <div class="slot-actions">
          <button class="action-btn" @click="save(i)">Save</button>
          <button class="action-btn" @click="set(i)">Set</button>
          <button class="action-btn" @click="swap(i)">Swap</button>
        </div>
        <input
            v-model="dc.strVal"
            type="number"
            class="slot-value"
            @keydown="e => checkDigit(e, i)"
            @focus="selectAll"
            @focusout="update(dc)"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.saved-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.slot {
  border: 1px solid var(--p-primary-color);
  border-radius: 0.375rem;
  overflow: hidden;
}

.slot-label {
  display: block;
  width: 100%;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.6;
  padding: 0.2rem 0.5rem;
  background: color-mix(in srgb, var(--p-primary-color), transparent 90%);
  border: none;
  outline: none;
  color: inherit;
  text-align: center;
}

.slot-body {
  display: flex;
  align-items: center;
}

.slot-actions {
  display: flex;
  flex: 1;
}

.action-btn {
  flex: 1;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.3rem 0;
  background: transparent;
  border: none;
  border-right: 1px solid var(--p-primary-color);
  color: var(--p-primary-color);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: color-mix(in srgb, var(--p-primary-color), transparent 85%);
  }

  &:active {
    background: color-mix(in srgb, var(--p-primary-color), transparent 70%);
  }
}

.slot-value {
  width: 3rem;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.3rem 0.25rem;
  background: color-mix(in srgb, var(--p-primary-color), transparent 85%);
  border: none;
  outline: none;
  color: var(--p-primary-color);

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; }
}
</style>
