import {reactive} from 'vue'
import {Skill} from "./types";

export interface iCheckState {
    selected: boolean,
    hover: boolean,
}


export type selectable = Skill | 'perception'

type managable = {
    checkAll: boolean,
    checkAllIntermediate: boolean,
    perception: iCheckState,
    [Skill.acrobatics]: iCheckState,
    [Skill.arcana]: iCheckState,
    [Skill.athletics]: iCheckState,
    [Skill.crafting]: iCheckState,
    [Skill.deception]: iCheckState,
    [Skill.diplomacy]: iCheckState,
    [Skill.intimidation]: iCheckState,
    [Skill.medicine]: iCheckState,
    [Skill.nature]: iCheckState,
    [Skill.occultism]: iCheckState,
    [Skill.performance]: iCheckState,
    [Skill.religion]: iCheckState,
    [Skill.society]: iCheckState,
    [Skill.stealth]: iCheckState,
    [Skill.survival]: iCheckState,
    [Skill.thievery]: iCheckState,
    lores: Array<iCheckState>,
    loreCount(): number,
    loreKeys(): Array<number>,
    skillKeys(): Array<Skill>,
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
    [Skill.acrobatics]: {selected: true, hover: false},
    [Skill.arcana]: {selected: true, hover: false},
    [Skill.athletics]: {selected: true, hover: false},
    [Skill.crafting]: {selected: true, hover: false},
    [Skill.deception]: {selected: true, hover: false},
    [Skill.diplomacy]: {selected: true, hover: false},
    [Skill.intimidation]: {selected: true, hover: false},
    [Skill.medicine]: {selected: true, hover: false},
    [Skill.nature]: {selected: true, hover: false},
    [Skill.occultism]: {selected: true, hover: false},
    [Skill.performance]: {selected: true, hover: false},
    [Skill.religion]: {selected: true, hover: false},
    [Skill.society]: {selected: true, hover: false},
    [Skill.stealth]: {selected: true, hover: false},
    [Skill.survival]: {selected: true, hover: false},
    [Skill.thievery]: {selected: true, hover: false},
    lores: Array<iCheckState>(),
    loreCount() {
        return this.lores.length
    },

    loreKeys(): Array<number> {
        return Array.from(Array(this.lores.length).keys())
    },

    skillKeys(): Array<Skill> {
        return Array.from(Object.values(Skill));
    },

    toggle(skill: selectable) {
        console.log("Toggle", skill, !this[skill as Skill].selected);
        console.log(this[skill].selected)
        this[skill as Skill].selected = !this[skill as Skill].selected;
        console.log(this[skill].selected)
    },

    selectOnly(skill: selectable) {
        console.log("Select only lore", skill);

        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(otherSkill => {
            console.log(otherSkill, skill, skill == otherSkill);
            this[skill as Skill].selected = skill == otherSkill;
        })
        this.perception.selected = skill == 'perception';
        this.lores.forEach(l => l.selected = false)
    },

    selectOnlyLore(n: number) {
        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(skill => {
            this[skill as Skill].selected = false;
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
            this[skill as Skill].selected = to;
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

type DCreact = {
    value: number,
    resetValue: number | undefined,
    set(newValue: number, setReset: boolean, clearReset: boolean): void,
    add(value: number): void,
    setReset(): void
}


export const DC = reactive<DCreact>({
    value: 15,
    resetValue: undefined,
    minDC: 0,
    maxDC: 60,
    set(v: number, reset: boolean, clearReset = false) {
        console.log("Set DC to ", v)
        if (reset && this.resetValue == undefined && v != this.value)
            this.resetValue = this.value
        else if (clearReset)
            this.resetValue = undefined

        if (this.value < this.minDC)
            this.value = this.minDC;
        else if (this.value > this.maxDC)
            this.value = this.maxDC
        else
            this.value = v
    },

    add(addition: number, reset: boolean) {
        this.set(this.value + addition, reset)
    },

    setReset() {
        this.value = this.resetValue;
        this.resetValue = undefined;
    }
})


