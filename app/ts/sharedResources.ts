import {reactive, ref} from 'vue'
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

export const Selected = ref<managable>({
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

    selectOnly(skill: selectable) {
        this[skill as Skills].selected = true;
    },

    selectOnlyLore(n: number) {
        this.lores.forEach((l, i) => l.selected = i === n);
    },

    toggle(skill: selectable) {
        console.log("Toggle", skill, !this[skill as Skills].selected);
        console.log(this[skill].selected)
        this[skill as Skills].selected = !this[skill as Skills].selected;
        console.log(this[skill].selected)
    },


    selectTotal(to: boolean) {
        console.log("Setting selection for all to be", to)
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
        const allSelected = this.skillKeys().every(s => this[s].selected) && this.perception.selected;
        const noneSelected = this.skillKeys().every(s => !this[s].selected) && !this.perception.selected;
        this.checkAll = allSelected;
        this.checkAllIntermediate = !allSelected && !noneSelected;
    },
})

const MIN_DC = 0;
const MAX_DC = 60;

function clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

interface  rollingFunction {
    (): void;
}

type roller = {
    roller: rollingFunction | undefined;
    setRoller(rf: rollingFunction): void;
    rollAll() : void;
}

export const Roller = reactive<roller>({
    roller: undefined,
    setRoller(rf : rollingFunction) {
        this.roller = rf
    },
    rollAll()  {
        console.log("Rolling in roller")
        if (this.roller != undefined) {
            this.roller()
        }
    }
});

type DCreact = {
    value: number;
    resetValue?: number;
    roller: rollingFunction | undefined;
    set(newValue: number, shouldReset: boolean, shouldClearReset?: boolean): void;
    add(addition: number, shouldReset: boolean): void;
    setReset(): void;
};

export const DC = reactive<DCreact>({
    value: 15,
    resetValue: undefined,
    roller: undefined,

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

