

export interface RollerSettings {
    showAC : true,
    showVulnerabilities : true,
    showResistances: true,
    showPerception: true,
    showSkills: true,
    showLores: true,
}


export interface RollerShortcuts {
    Saved1 : string;
    Saved2 : string;
    Saved3 : string;
    Saved4 : string;
    Saved5 : string;
    Saved6 : string;
    Reset : string;
    Untrained: string;
    Trained: string;
    Expert: string;
    Master: string;
    Legendary:string;
}


export function defaultShortcuts() : RollerShortcuts {
    return  {
        Saved1: "1",
        Saved2: "2",
        Saved3: "3",
        Saved4: "4",
        Saved5: "5",
        Saved6: "6",
        Reset: "R",
        Untrained: "U",
        Trained: "T",
        Expert: "E",
        Master: "M",
        Legendary: "L"
    }
}


