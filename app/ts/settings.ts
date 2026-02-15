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

export interface RollerShortcuts {
    savedRolls: {
        slot1: string;
        slot2: string;
        slot3: string;
        slot4: string;
        slot5: string;
        slot6: string;
    };
    actions: {
        reset: string;
        untrained: string;
        trained: string;
        expert: string;
        master: string;
        legendary: string;
    };
}

export const DEFAULT_SHORTCUTS: RollerShortcuts = {
    savedRolls: {
        slot1: "1",
        slot2: "2",
        slot3: "3",
        slot4: "4",
        slot5: "5",
        slot6: "6",
    },
    actions: {
        reset: "R",
        untrained: "U",
        trained: "T",
        expert: "E",
        master: "M",
        legendary: "L",
    }
};
