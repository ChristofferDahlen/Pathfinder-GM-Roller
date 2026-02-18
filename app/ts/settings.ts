import {computed, reactive, ref} from "vue";
import {onKeyStroke, useActiveElement, useMagicKeys} from "@vueuse/core";


export const shortCutsActive = ref<boolean>(true);

export function disableShortcuts() {
    shortCutsActive.value = false;
}

export function enableShortcuts() {
    shortCutsActive.value = true;
}

export interface RollerSettings {
    displayOptions: {
        armorClass: boolean;
        vulnerabilities: boolean;
        resistances: boolean;
        perception: boolean;
        skills: boolean;
        lores: boolean;
    };
}

export const DEFAULT_ROLLER_SETTINGS: RollerSettings = {
    displayOptions: {
        armorClass: true,
        vulnerabilities: true,
        resistances: true,
        perception: true,
        skills: true,
        lores: true,
    }
};

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



export const RollerShortcuts = reactive<Record<shortcutsEnum, string>>({
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


})

export const OrganizedShortCuts =
    {
        savedRolls: [
            shortcutsEnum.setSlot1,
            shortcutsEnum.setSlot2,
            shortcutsEnum.setSlot3,
            shortcutsEnum.setSlot4,
            shortcutsEnum.setSlot5,
        ],
        actions: []

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

        const shortcutString =  RollerShortcuts[key].toLowerCase()
        let ctrl = false
        let shift = false
        let alt = false
        const keyPres = shortcutString.substring(shortcutString.length - 1)

        if(/[+_-]/.test(shortcutString))
        {
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

        console.log(keyEvent)

        for (const i in keysTo) {
            const key = keysTo[i]
            if (magicKey[RollerShortcuts[key]].value) {
                console.info("Shortcut ", key, " occurred")
                func(key, keyEvent)
                break;
            }
        }
    })
}

