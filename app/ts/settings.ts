import {computed, reactive, ref} from "vue";
import {onKeyStroke, useActiveElement, useMagicKeys} from "@vueuse/core";


export const shortCutsActive = ref<boolean>(true);

export function disableShortcuts() {
    shortCutsActive.value = false;
}

export function enableShortcuts() {
    shortCutsActive.value = true;
}


export const  ShowArmorClass = ref(false)

export type setting = {
    name: string;
    state: boolean
}


export type DefenseSettings = {
    ShowArmorClass: setting;
    ShowFortitude: setting;
    ShowReflex: setting;
    ShowWill: setting;
    showVulnerabilities: setting;
    showResistances: setting;
}

export type DCSettings = {
    ShowClassDC: setting;
    ShowSpellDC: setting;
}


export type SkillSettings = {
    ShowPerception: setting;
    ShowLores: setting;
    ShowLanguages :setting;
}


export type MiscSettings = {
    ShowClass :setting;
    ShowPartyName : setting;
    ShowPlayerName: setting;
}




export type OrganizedSettingsInterface = {
    "Defenses" : DefenseSettings;
    "DCs" :DCSettings;
    "Skills": SkillSettings;
    "Misc" : MiscSettings
}

export function BasicSettings() : OrganizedSettingsInterface {
    return {
        "Defenses": {
            ShowArmorClass: {name: "Show Armor Class", state: true},
            ShowFortitude: {name: "Show Fortitude", state: true},
            ShowReflex: {name: "Show Reflex", state: true},
            ShowWill: {name: "Show Will", state: true},
            showVulnerabilities: {name: "Show Vulnerabilities", state: true},
            showResistances: {name: "Show Resistances", state: true},
        },
        "DCs": {
            ShowClassDC: {name: "Show Class DC", state: true},
            ShowSpellDC: {name: "Show Spell DC", state: true},
        },
        "Skills": {
            ShowPerception: {name: "Show Perception", state: true},
            ShowLores: {name: "Show Lores", state: true},
            ShowLanguages: {name: "Show Languages", state: true},
        },
        "Misc": {
            ShowClass: {name: "Show Class Name", state: true},
            ShowPartyName: {name: "Show Party Name", state: true},
            ShowPlayerName: {name: "Show Player Names", state: true},
        }
    }
}

export const  OrganizedSettings = ref<OrganizedSettingsInterface>(BasicSettings())



export enum shortcutsEnum {
    rollAll = "Roll All",
    // saved DCs set shoutcuts
    setSlot1 = "Set slot 1",
    setSlot2 = "Set slot 2",
    setSlot3 = "Set slot 3",
    setSlot4 = "Set slot 4",
    setSlot5 = "Set slot 5",
    setSlot6 = "Set slot 6",
    // Swap shortcuts
    swapSlot1 = "Swap slot 1",
    swapSlot2 = "Swap slot 2",
    swapSlot3 = "Swap slot 3",
    swapSlot4 = "Swap slot 4",
    swapSlot5 = "Swap slot 5",
    swapSlot6 = "Swap slot 6",
}

export function BasicShortcuts(): Record<shortcutsEnum, string> {
    return {
        [shortcutsEnum.rollAll]: "space",

        [shortcutsEnum.setSlot1]: "1",
        [shortcutsEnum.setSlot2]: "2",
        [shortcutsEnum.setSlot3]: "3",
        [shortcutsEnum.setSlot4]: "4",
        [shortcutsEnum.setSlot5]: "5",
        [shortcutsEnum.setSlot6]: "6",

        [shortcutsEnum.swapSlot1]: "q",
        [shortcutsEnum.swapSlot2]: "w",
        [shortcutsEnum.swapSlot3]: "e",
        [shortcutsEnum.swapSlot4]: "r",
        [shortcutsEnum.swapSlot5]: "t",
        [shortcutsEnum.swapSlot6]: "y",

    }
}


export const RollerShortcuts = ref<Record<shortcutsEnum, string>>(BasicShortcuts())

export const OrganizedShortCuts =
    {
        "Main": [
            shortcutsEnum.rollAll
        ],
        "Saved Rolls": [
            shortcutsEnum.setSlot1,
            shortcutsEnum.setSlot2,
            shortcutsEnum.setSlot3,
            shortcutsEnum.setSlot4,
            shortcutsEnum.setSlot5,
            shortcutsEnum.setSlot6,
            shortcutsEnum.swapSlot1,
            shortcutsEnum.swapSlot2,
            shortcutsEnum.swapSlot3,
            shortcutsEnum.swapSlot4,
            shortcutsEnum.swapSlot5,
            shortcutsEnum.swapSlot6,
        ],

    }

export interface shortcutCode {
    key: string,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
}


export const computed_ref = computed((): Record<shortcutsEnum, shortcutCode> => {
    const comp = {}
    for (const key in RollerShortcuts) {

        const shortcutString = RollerShortcuts[key].toLowerCase()
        let ctrl = false
        let shift = false
        let alt = false
        const keyPres = shortcutString.substring(shortcutString.length - 1)

        if (/[+_-]/.test(shortcutString)) {
            const keys = shortcutString.split(/[+_-]/g).map((i) => i.trim())

            ctrl = "ctrl" in keys;
            shift = "shift" in keys;
            alt = "alt" in keys;
            console.log("K", keys)
        }
        console.log()

        comp[key] = {key: keyPres, ctrl: ctrl, shift: shift, alt: alt}
    }
    console.log("Update")
    console.log(comp)

    return comp
},)


export function onShortcutKey(keysTo: Array<shortcutsEnum>, func: (sc: shortcutsEnum, event: KeyboardEvent) => void) {

    const magicKey = useMagicKeys()
    const activeElement = useActiveElement();
    const usingInput = computed(() => {
            return activeElement.value?.tagName === 'TEXTAREA' || activeElement.value?.tagName === 'INPUT'
        }
        ,);

    return onKeyStroke((keyEvent) => {
        if (usingInput.value || !shortCutsActive.value)
            return

        for (const i in keysTo) {
            const key = keysTo[i]
            if (magicKey[RollerShortcuts.value[key]].value) {
                console.info("Shortcut ", key, " occurred")
                func(key, keyEvent)
                break;
            }
        }
    })
}

