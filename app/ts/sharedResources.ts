import {reactive} from 'vue'
import {Skills} from "./types";

export interface iCheckState {
    selected: boolean,
    hover: boolean,
}


export type selectable = Skills | 'perception'

type managable = {
    checkAll: boolean,
    checkAllIntermediate: boolean,
    perception: iCheckState,
    [Skills.acrobatics]: iCheckState,
    [Skills.arcana]: iCheckState,
    [Skills.athletics]: iCheckState,
    [Skills.crafting]: iCheckState,
    [Skills.deception]: iCheckState,
    [Skills.diplomacy]: iCheckState,
    [Skills.intimidation]: iCheckState,
    [Skills.medicine]: iCheckState,
    [Skills.nature]: iCheckState,
    [Skills.occultism]: iCheckState,
    [Skills.performance]: iCheckState,
    [Skills.religion]: iCheckState,
    [Skills.society]: iCheckState,
    [Skills.stealth]: iCheckState,
    [Skills.survival]: iCheckState,
    [Skills.thievery]: iCheckState,
    lores: Array<iCheckState>,
    loreCount(): number,
    loreKeys(): Array<number>,
    skillKeys(): Array<Skills>,
    toggle(skill: selectable): void,
    selectOnly(skill: selectable): void,
    selectOnlyLore(n: number): void,
    selectTotal(b: boolean): void,
    selectNone(): void,
    selectAll(): void,
    selectSkills(skills: Array<selectable | 'lore'>): void
    partialSelect(): void
}

export const Selected = reactive<managable>({
    checkAll: true,
    checkAllIntermediate: false,
    perception: {selected: true, hover: false},
    [Skills.acrobatics]: {selected: true, hover: false},
    [Skills.arcana]: {selected: true, hover: false},
    [Skills.athletics]: {selected: true, hover: false},
    [Skills.crafting]: {selected: true, hover: false},
    [Skills.deception]: {selected: true, hover: false},
    [Skills.diplomacy]: {selected: true, hover: false},
    [Skills.intimidation]: {selected: true, hover: false},
    [Skills.medicine]: {selected: true, hover: false},
    [Skills.nature]: {selected: true, hover: false},
    [Skills.occultism]: {selected: true, hover: false},
    [Skills.performance]: {selected: true, hover: false},
    [Skills.religion]: {selected: true, hover: false},
    [Skills.society]: {selected: true, hover: false},
    [Skills.stealth]: {selected: true, hover: false},
    [Skills.survival]: {selected: true, hover: false},
    [Skills.thievery]: {selected: true, hover: false},
    lores: Array<iCheckState>(),
    loreCount() {
        return this.lores.length
    },

    loreKeys(): Array<number> {
        return Array.from(Array(this.lores.length).keys())
    },

    skillKeys(): Array<Skills> {
        return Array.from(Object.values(Skills));
    },

    toggle(skill: selectable) {
        console.log("Toggle", skill, !this[skill as Skills].selected);
        console.log(this[skill].selected)
        this[skill as Skills].selected = !this[skill as Skills].selected;
        console.log(this[skill].selected)
    },

    selectOnly(skill: selectable) {
        console.log("Select only lore", skill);

        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(otherSkill => {
            console.log(otherSkill, skill, skill == otherSkill);
            this[skill as Skills].selected = skill == otherSkill;
        })
        this.perception.selected = skill == 'perception';
        this.lores.forEach(l => l.selected = false)
    },

    selectOnlyLore(n: number) {
        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(skill => {
            this[skill as Skills].selected = false;
        })

        this.perception.selected = false;
        this.lores.forEach((l, nn) => {
            console.log(n, nn, n == nn);
            l.selected = n == nn
        })
    },

    selectTotal(to: boolean) {
        console.log(this.skillKeys())
        this.skillKeys().forEach(skill => {
            this[skill as Skills].selected = to;
        })

        this.lores.forEach(k => k.selected = to);
        this.perception.selected = to

        this.checkAllIntermediate = false;
        this.checkAll = to;
    },

    selectNone() {
        this.selectTotal(false)
    },

    selectAll() {
        this.selectTotal(true)
    },

    selectSkills(skills: Array<selectable | 'lore'>) {
        console.log("Selecting skills", skills)
        this.selectNone()

        skills.forEach(skill => {
            if (skill == 'lore') {
                this.lores.forEach(l => l.selected = true)
            } else {
                this[skill as selectable].selected = true;
            }
            console.log("on", skill)
        })

        this.checkAllIntermediate = true
        this.checkAll = false
    },

    partialSelect() {
        this.checkAllIntermediate = false
        this.checkAll = false
    }
})

const MIN_DC = 0;
const MAX_DC = 60;

function clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

type DCreact = {
    value: number;
    resetValue?: number;
    set(newValue: number, shouldReset: boolean, shouldClearReset?: boolean): void;
    add(addition: number, shouldReset: boolean): void;
    setReset(): void;
};

export const DC = reactive<DCreact>({
    value: 15,
    resetValue: undefined,

    set(newValue, shouldReset, shouldClearReset = false) {
        console.log("Set DC to", newValue);

        if (shouldReset && this.resetValue == undefined && newValue !== this.value) {
            this.resetValue = this.value;
        }

        if (shouldClearReset) {
            this.resetValue = undefined;
        }

        // Use the clampValue function to apply boundaries
        this.value = clampValue(newValue, MIN_DC, MAX_DC);
    },

    add(addition, shouldReset) {
        this.set(this.value + addition, shouldReset);
    },

    setReset() {
        if (this.resetValue !== undefined) {
            this.value = this.resetValue;
            this.resetValue = undefined;
        }
    },
});
