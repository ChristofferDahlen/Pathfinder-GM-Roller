import {reactive} from 'vue'
import {type iSelectedDisplay, type iSkillTable, skillEnum} from "~/ts/types.ts";

export interface iCheckState {
    selected: boolean,
    hover: boolean,
}



export type selectable = skillEnum | 'perception'

type managable = {
    checkAll: boolean,
    checkAllIntermediate: boolean,
    perception: iCheckState,
    [skillEnum.acrobatics]: iCheckState,
    [skillEnum.arcana]: iCheckState,
    [skillEnum.athletics]: iCheckState,
    [skillEnum.crafting]: iCheckState,
    [skillEnum.deception]: iCheckState,
    [skillEnum.diplomacy]: iCheckState,
    [skillEnum.intimidation]: iCheckState,
    [skillEnum.medicine]: iCheckState,
    [skillEnum.nature]: iCheckState,
    [skillEnum.occultism]: iCheckState,
    [skillEnum.performance]: iCheckState,
    [skillEnum.religion]: iCheckState,
    [skillEnum.society]: iCheckState,
    [skillEnum.stealth]: iCheckState,
    [skillEnum.survival]: iCheckState,
    [skillEnum.thievery]: iCheckState,
    lores: Array<iCheckState>,
    loreCount() : number,
    loreKeys() : Array<number>,
    skillKeys() : Array<skillEnum>,
    toggle(skill : selectable) : void,
    selectOnly(skill : selectable) : void,
    selectOnlyLore(n : number) : void,
    selectTotal(b : boolean) : void,
    selectNone() : void,
    selectAll() : void,
    selectSkills(skills: Array<selectable | 'lore'>) : void
    partialSelect() : void
}

export const Selected = reactive<managable>({
    checkAll: true,
    checkAllIntermediate: false,
    perception: {selected: true, hover:false},
    [skillEnum.acrobatics]: {selected: true, hover:false},
    [skillEnum.arcana]: {selected: true, hover:false},
    [skillEnum.athletics]: {selected: true, hover:false},
    [skillEnum.crafting]: {selected: true, hover:false},
    [skillEnum.deception]: {selected: true, hover:false},
    [skillEnum.diplomacy]: {selected: true, hover:false},
    [skillEnum.intimidation]: {selected: true, hover:false},
    [skillEnum.medicine]: {selected: true, hover:false},
    [skillEnum.nature]: {selected: true, hover:false},
    [skillEnum.occultism]: {selected: true, hover:false},
    [skillEnum.performance]: {selected: true, hover:false},
    [skillEnum.religion]: {selected: true, hover:false},
    [skillEnum.society]: {selected: true, hover:false},
    [skillEnum.stealth]: {selected: true, hover:false},
    [skillEnum.survival]: {selected: true, hover:false},
    [skillEnum.thievery]: {selected: true, hover:false},
    lores: Array<iCheckState>(),
    loreCount() {
        return this.lores.length
    },

    loreKeys() : Array<number> {
        return Array.from(Array(this.lores.length).keys())
    },

    skillKeys() : Array<skillEnum> {
        return Array.from(Object.values(skillEnum));
    },

    toggle(skill : selectable) {
        console.log("Toggle", skill, !this[skill as skillEnum].selected);
        console.log(this[skill].selected)
        this[skill as skillEnum].selected = !this[skill as skillEnum].selected;
        console.log(this[skill].selected)
    },

    selectOnly(skill : selectable) {
        console.log("Select only lore", skill);

        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(otherSkill => {
            console.log(otherSkill, skill, skill == otherSkill );
            this[skill as skillEnum].selected = skill == otherSkill;
        })
        this.perception.selected = skill == 'perception';
        this.lores.forEach(l => l.selected=false)
    },

    selectOnlyLore(n : number){
        this.checkAll = false;
        this.checkAllIntermediate = true;

        this.skillKeys().forEach(skill => {
            this[skill as skillEnum].selected = false;
        })

        this.perception.selected = false;
        this.lores.forEach((l, nn) => {
            console.log(n, nn, n == nn );
            l.selected = n == nn
             })
    },

    selectTotal(to : boolean) {
        console.log(this.skillKeys())
        this.skillKeys().forEach(skill => {
            this[skill as skillEnum].selected = to;
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
            if(skill == 'lore') {
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


export const DC = reactive({
    value: 15,
    resetValue: undefined | Number,
    minDC: 0,
    maxDC: 60,
    set(v: number, reset: boolean, clearReset = false ) {
        console.log("Set DC to ", v)
        if (reset && this.resetValue == undefined)
            this.resetValue = this.value
        else if(clearReset)
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

    reset() {
        this.value = this.resetValue;
        this.resetValue = undefined;
    }
})


