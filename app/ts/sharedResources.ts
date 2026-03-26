import { reactive, ref } from 'vue'
import { Skills } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface iCheckState {
    selected: boolean
    hover: boolean
}

export type selectable = Skills | 'perception'

type Managable = {
    checkAll: boolean
    checkAllIntermediate: boolean
    perception: iCheckState
    lores: iCheckState[]
    [skill: string]: unknown
    loreCount(): number
    loreKeys(): number[]
    skillKeys(): Skills[]
    toggle(skill: selectable): void
    selectOnly(skill: selectable): void
    selectOnlyLore(n: number): void
    selectTotal(b: boolean): void
    selectNone(): void
    selectAll(): void
    selectSkills(skills: Array<selectable | 'lore'>): void
    partialSelect(): void
} & { [K in Skills]: iCheckState }

// ── Selected skills state ─────────────────────────────────────────────────────

const defaultSkillState = (): iCheckState => ({ selected: true, hover: false })

export const Selected = ref<Managable>({
    checkAll: true,
    checkAllIntermediate: false,
    perception: defaultSkillState(),
    [Skills.acrobatics]: defaultSkillState(),
    [Skills.arcana]: defaultSkillState(),
    [Skills.athletics]: defaultSkillState(),
    [Skills.crafting]: defaultSkillState(),
    [Skills.deception]: defaultSkillState(),
    [Skills.diplomacy]: defaultSkillState(),
    [Skills.intimidation]: defaultSkillState(),
    [Skills.medicine]: defaultSkillState(),
    [Skills.nature]: defaultSkillState(),
    [Skills.occultism]: defaultSkillState(),
    [Skills.performance]: defaultSkillState(),
    [Skills.religion]: defaultSkillState(),
    [Skills.society]: defaultSkillState(),
    [Skills.stealth]: defaultSkillState(),
    [Skills.survival]: defaultSkillState(),
    [Skills.thievery]: defaultSkillState(),
    lores: [] as iCheckState[],

    loreCount() { return this.lores.length },
    loreKeys() { return Array.from({ length: this.lores.length }, (_, i) => i) },
    skillKeys() { return Object.values(Skills) },

    toggle(skill: selectable) {
        this[skill as Skills].selected = !this[skill as Skills].selected;
    },

    selectOnly(skill: selectable) {
        this[skill as Skills].selected = true;
    },

    selectOnlyLore(n: number) {
        this.lores.forEach((l, i) => { l.selected = i === n });
    },

    selectTotal(to: boolean) {
        this.skillKeys().forEach(skill => { this[skill].selected = to });
        this.lores.forEach(l => { l.selected = to });
        this.perception.selected = to;
        this.checkAll = to;
        this.checkAllIntermediate = false;
    },

    selectNone() { this.selectTotal(false) },
    selectAll()  { this.selectTotal(true) },

    selectSkills(skills: Array<selectable | 'lore'>) {
        this.selectNone();
        for (const skill of skills) {
            if (skill === 'lore') {
                this.lores.forEach(l => { l.selected = true });
            } else {
                this[skill as selectable].selected = true;
            }
        }
        this.checkAll = false;
        this.checkAllIntermediate = true;
    },

    partialSelect() {
        const allSelected = this.skillKeys().every(s => this[s].selected) && this.perception.selected;
        const noneSelected = this.skillKeys().every(s => !this[s].selected) && !this.perception.selected;
        this.checkAll = allSelected;
        this.checkAllIntermediate = !allSelected && !noneSelected;
    },
})

// ── Roller ────────────────────────────────────────────────────────────────────

type RollingFn = () => void

export const Roller = reactive({
    roller: undefined as RollingFn | undefined,

    setRoller(fn: RollingFn) { this.roller = fn },

    rollAll() {
        this.roller?.();
    },
})

// ── DC state ──────────────────────────────────────────────────────────────────

const MIN_DC = 0;
const MAX_DC = 60;

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export const DC = reactive({
    value: 15,
    resetValue: undefined as number | undefined,
    roller: undefined as RollingFn | undefined,

    set(newValue: number, shouldReset: boolean, shouldClearReset = false) {
        if (shouldReset && this.resetValue === undefined && newValue !== this.value) {
            this.resetValue = this.value;
        }
        if (shouldClearReset) {
            this.resetValue = undefined;
        }
        this.value = clamp(newValue, MIN_DC, MAX_DC);
    },

    add(amount: number, shouldReset: boolean) {
        this.set(this.value + amount, shouldReset);
    },

    setReset() {
        if (this.resetValue !== undefined) {
            this.value = this.resetValue;
            this.resetValue = undefined;
        }
    },
})
