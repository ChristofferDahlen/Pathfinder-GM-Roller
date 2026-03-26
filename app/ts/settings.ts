import { computed, ref } from "vue";
import { onKeyStroke, useActiveElement, useMagicKeys } from "@vueuse/core";

// ── Shortcut active state ─────────────────────────────────────────────────────

export const shortCutsActive = ref(true);
export const disableShortcuts = () => { shortCutsActive.value = false };
export const enableShortcuts  = () => { shortCutsActive.value = true  };

// ── Settings types ────────────────────────────────────────────────────────────

export type setting = { name: string; state: boolean }

export type DefenseSettings = {
    ShowArmorClass: setting
    ShowFortitude: setting
    ShowReflex: setting
    ShowWill: setting
    showVulnerabilities: setting
    showResistances: setting
}

export type DCSettings = {
    ShowClassDC: setting
    ShowSpellDC: setting
}

export type SkillSettings = {
    ShowPerception: setting
    ShowLores: setting
    ShowLanguages: setting
}

export type MiscSettings = {
    ShowClass: setting
    ShowPartyName: setting
    ShowPlayerName: setting
    ShowHoverModifiers: setting
}

export type OrganizedSettingsInterface = {
    Defenses: DefenseSettings
    DCs: DCSettings
    Skills: SkillSettings
    Misc: MiscSettings
}

export function BasicSettings(): OrganizedSettingsInterface {
    return {
        Defenses: {
            ShowArmorClass:      { name: "Show Armor Class",    state: true },
            ShowFortitude:       { name: "Show Fortitude",      state: true },
            ShowReflex:          { name: "Show Reflex",         state: true },
            ShowWill:            { name: "Show Will",           state: true },
            showVulnerabilities: { name: "Show Vulnerabilities",state: true },
            showResistances:     { name: "Show Resistances",    state: true },
        },
        DCs: {
            ShowClassDC: { name: "Show Class DC", state: true },
            ShowSpellDC: { name: "Show Spell DC", state: true },
        },
        Skills: {
            ShowPerception: { name: "Show Perception", state: true },
            ShowLores:      { name: "Show Lores",      state: true },
            ShowLanguages:  { name: "Show Languages",  state: true },
        },
        Misc: {
            ShowClass:           { name: "Show Class Name",       state: true },
            ShowPartyName:       { name: "Show Party Name",       state: true },
            ShowPlayerName:      { name: "Show Player Names",     state: true },
            ShowHoverModifiers:  { name: "Show Hover Modifiers",  state: true },
        },
    };
}

export const OrganizedSettings = ref<OrganizedSettingsInterface>(BasicSettings());

// ── Shortcuts ─────────────────────────────────────────────────────────────────

export enum shortcutsEnum {
    rollAll   = "Roll All",
    dcUp      = "DC +1",
    dcDown    = "DC -1",
    dcUp5     = "DC +5",
    dcDown5   = "DC -5",
    setSlot1  = "Set slot 1",
    setSlot2  = "Set slot 2",
    setSlot3  = "Set slot 3",
    setSlot4  = "Set slot 4",
    setSlot5  = "Set slot 5",
    setSlot6  = "Set slot 6",
    swapSlot1 = "Swap slot 1",
    swapSlot2 = "Swap slot 2",
    swapSlot3 = "Swap slot 3",
    swapSlot4 = "Swap slot 4",
    swapSlot5 = "Swap slot 5",
    swapSlot6 = "Swap slot 6",
}

export function BasicShortcuts(): Record<shortcutsEnum, string> {
    return {
        [shortcutsEnum.rollAll]:  "space",
        [shortcutsEnum.dcUp]:     "+",
        [shortcutsEnum.dcDown]:   "-",
        [shortcutsEnum.dcUp5]:    "alt++",
        [shortcutsEnum.dcDown5]:  "alt+-",
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
    };
}

export const RollerShortcuts = ref<Record<shortcutsEnum, string>>(BasicShortcuts());

export const OrganizedShortCuts = {
    "Main": [shortcutsEnum.rollAll, shortcutsEnum.dcUp, shortcutsEnum.dcDown, shortcutsEnum.dcUp5, shortcutsEnum.dcDown5],
    "Saved Rolls": [
        shortcutsEnum.setSlot1, shortcutsEnum.setSlot2, shortcutsEnum.setSlot3,
        shortcutsEnum.setSlot4, shortcutsEnum.setSlot5, shortcutsEnum.setSlot6,
        shortcutsEnum.swapSlot1, shortcutsEnum.swapSlot2, shortcutsEnum.swapSlot3,
        shortcutsEnum.swapSlot4, shortcutsEnum.swapSlot5, shortcutsEnum.swapSlot6,
    ],
};

export interface shortcutCode {
    key: string
    ctrl: boolean
    shift: boolean
    alt: boolean
}

export const computed_ref = computed((): Record<shortcutsEnum, shortcutCode> => {
    const result = {} as Record<shortcutsEnum, shortcutCode>;

    for (const key in RollerShortcuts.value) {
        const raw = RollerShortcuts.value[key as shortcutsEnum].toLowerCase();
        const parts = /[+_-]/.test(raw) ? raw.split(/[+_-]/g).map(s => s.trim()) : [];

        result[key as shortcutsEnum] = {
            key:   raw.slice(-1),
            ctrl:  parts.includes("ctrl"),
            shift: parts.includes("shift"),
            alt:   parts.includes("alt"),
        };
    }

    return result;
});

export function onShortcutKey(
    keysTo: shortcutsEnum[],
    func: (sc: shortcutsEnum, event: KeyboardEvent) => void
) {
    const activeElement = useActiveElement();
    const usingInput = computed(() =>
        activeElement.value?.tagName === 'TEXTAREA' || activeElement.value?.tagName === 'INPUT'
    );

    return onKeyStroke((event) => {
        if (usingInput.value || !shortCutsActive.value) return;
        if (event.repeat) return;

        for (const key of keysTo) {
                const raw = RollerShortcuts.value[key].toLowerCase();
            // Handle combos like "ctrl++", "ctrl+-" where last char is the literal key
            // Split modifiers from the main key: everything before the last separator
            const modMatch = raw.match(/^((?:(?:ctrl|shift|alt)[+_])+)(.+)$/);
            const parts = modMatch ? modMatch[1].split(/[+_]/g).filter(Boolean) : [];
            const mainKey = modMatch ? modMatch[2] : raw;
            const needsCtrl  = parts.includes("ctrl");
            const needsShift = parts.includes("shift");
            const needsAlt   = parts.includes("alt");

            if (
                event.key.toLowerCase() === mainKey &&
                event.ctrlKey  === needsCtrl &&
                event.shiftKey === needsShift &&
                event.altKey   === needsAlt
            ) {
                func(key, event);
                break;
            }
        }
    });
}
