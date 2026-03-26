<template>
  <div class="info-view">

    <section>
      <p class="overview-text">
        A Pathfinder 2e GM tool for tracking party skill checks against a DC in real time.
      </p>
    </section>

    <div class="sections-grid">

      <div class="info-card">
        <div class="card-header">
          <MdiIcon icon="mdiTableLarge" class="card-icon"/>
          <span>Roll Table</span>
        </div>
        <ul>
          <li><kbd>Double-click</kbd> a result to reroll that check</li>
          <li><kbd>Double-click</kbd> a row label to roll all characters for that skill</li>
          <li><kbd>Double-click</kbd> a character header to roll all their skills</li>
          <li>Hover a result to see modifier breakdown and ±1–4 previews (can be toggled in Settings)</li>
          <li>Check a row checkbox to keep it focused — unfocused rows dim</li>
          <li>Hold <kbd>Ctrl</kbd> + click checkbox to select only that row</li>
        </ul>
      </div>

      <div class="info-card">
        <div class="card-header">
          <MdiIcon icon="mdiTarget" class="card-icon"/>
          <span>DC Panel</span>
        </div>
        <ul>
          <li>Type a DC directly or use the difficulty buttons to adjust</li>
          <li>Use the slider to sweep through DC values quickly</li>
          <li><strong>Simple DC</strong> — quick proficiency DC presets</li>
          <li><strong>Level Based DCs</strong> — DCs by creature or task level</li>
          <li><strong>Saved DCs</strong> — store up to 6 DCs, use Save / Set / Swap</li>
          <li><strong>Creature ID</strong> — Recall Knowledge DCs by creature trait</li>
          <li><strong>Auto Roll</strong> — roll automatically at a set interval</li>
        </ul>
      </div>

      <div class="info-card">
        <div class="card-header">
          <MdiIcon icon="mdiPalette" class="card-icon"/>
          <span>Result Colors</span>
        </div>
        <div class="color-legend">
          <div class="color-row">
            <span class="swatch" style="background:rgb(5 46 22)"/>
            <span>Critical Success</span>
          </div>
          <div class="color-row">
            <span class="swatch" style="background:rgb(30 58 138)"/>
            <span>Success</span>
          </div>
          <div class="color-row">
            <span class="swatch" style="background:rgb(69 10 10)"/>
            <span>Failure</span>
          </div>
          <div class="color-row">
            <span class="swatch" style="background:rgb(194 65 12)"/>
            <span>Critical Failure</span>
          </div>
          <div class="color-row">
            <span class="swatch border-2" style="background:transparent;border-color:rgb(132 204 22)"/>
            <span>Natural 20 border</span>
          </div>
          <div class="color-row">
            <span class="swatch border-2" style="background:transparent;border-color:rgb(254 251 232)"/>
            <span>Natural 1 border</span>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="card-header">
          <MdiIcon icon="mdiAccountEdit" class="card-icon"/>
          <span>Editing Characters</span>
        </div>
        <ul>
          <li>Click the edit button (top left) to open the character editor</li>
          <li>Set proficiency, attributes, item bonuses and penalties per skill</li>
          <li>Load from Pathbuilder 2e via build ID or pasted JSON</li>
          <li>Drag character tabs to reorder them</li>
        </ul>
      </div>

      <div class="info-card">
        <div class="card-header">
          <MdiIcon icon="mdiKeyboard" class="card-icon"/>
          <span>Keyboard Shortcuts</span>
        </div>
        <ul>
          <li>Roll all — rolls every visible skill for all characters</li>
          <li>Set slot 1–6 — load a saved DC slot from the keyboard</li>
          <li>Swap slot 1–6 — swap the current DC with a saved slot</li>
          <li>Shortcuts can be configured in the Settings panel</li>
        </ul>
      </div>

    </div>

    <div class="info-card mt-4" style="max-width:400px">
      <div class="card-header">
        <MdiIcon icon="mdiHeart" class="card-icon"/>
        <span>Acknowledgements</span>
      </div>
      <p class="mt-2 text-sm" style="opacity:0.85">
        Special thanks to <strong>Ashley Hemerik</strong> for help from
        <a href="https://pathfinderdashboard.com/" target="_blank" rel="noopener" class="thanks-link">pathfinderdashboard.com</a>.
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.info-view {
  padding: 1rem 1.5rem;
}

.overview-text {
  font-size: 1rem;
  opacity: 0.7;
  margin-bottom: 1.5rem;
}

.sections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.info-card {
  border-radius: 0.5rem;
  padding: 1rem;
  @apply bg-neutral-200 dark:bg-surface-800 border border-neutral-400 dark:border-surface-600;

  ul {
    margin-top: 0.5rem;
    padding-left: 1.25rem;
    list-style: disc;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.875rem;
    opacity: 0.85;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  padding-bottom: 0.5rem;
  @apply border-b border-neutral-400 dark:border-surface-600;
}

.card-icon {
  @apply text-primary-500;
}

.color-legend {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.875rem;
}

.swatch {
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 4px;
  flex-shrink: 0;
}

kbd {
  @apply bg-neutral-300 dark:bg-surface-700 border border-neutral-400 dark:border-surface-500;
  border-radius: 4px;
  padding: 0.1rem 0.35rem;
  font-size: 0.8rem;
  font-family: monospace;
}

.thanks-link {
  @apply text-primary-500;
  text-decoration: underline;
  &:hover { @apply text-primary-400; }
}
</style>
