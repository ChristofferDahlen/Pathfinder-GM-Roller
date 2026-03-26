import {
    Attribute,
    type iCharacter,
    type iDC,
    type iLore,
    type iProficiencies,
    type iVulRes,
    proficiencyLevel,
} from "./types";
import { capitalize } from "vue";

// ── Pathbuilder JSON interfaces ───────────────────────────────────────────────

export interface iPBChar {
    build: iPBBuild
}

export interface iPBAbilities {
    [Attribute.str]: number
    [Attribute.dex]: number
    [Attribute.con]: number
    [Attribute.int]: number
    [Attribute.wis]: number
    [Attribute.cha]: number
}

export interface iPBProficiencies {
    classDC: number
    perception: number
    fortitude: number
    reflex: number
    will: number
    heavy: number
    medium: number
    light: number
    unarmored: number
    advanced: number
    martial: number
    simple: number
    unarmed: number
    castingArcane: number
    castingDivine: number
    castingOccult: number
    castingPrimal: number
    acrobatics: number
    arcana: number
    athletics: number
    crafting: number
    deception: number
    diplomacy: number
    intimidation: number
    medicine: number
    nature: number
    occultism: number
    performance: number
    religion: number
    society: number
    stealth: number
    survival: number
    thievery: number
}

export interface iSpellsAtLevel {
    spellLevel: number
    list: string[]
}

export interface iSpellCaster {
    name: string
    magicTradition: string
    ability: string
    proficiency: number
    spells: iSpellsAtLevel[]
}

export interface iPbMod {
    "Status Bonus"?: number
    "Item Bonus"?: number
    "Circumstance Bonus"?: number
}

export interface iPBMods {
    [key: string]: iPbMod
}

export interface iAcTotal {
    acTotal: number
    shieldBonus: string
}

export interface iPBBuild {
    name: string
    class: string
    level: number
    resistances: string[]
    keyability: string
    feats: never[][]
    lores: never[][]
    acTotal: iAcTotal
    abilities: iPBAbilities
    proficiencies: iPBProficiencies
    spellCasters: iSpellCaster[]
    mods: iPBMods
    languages: string[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toModValue(score: number): number {
    return Math.floor((score - 10) / 2);
}

function parseResistance(str: string): iVulRes {
    const parts = str.split(" ");
    return {
        name: parts.slice(0, -1).join(" "),
        value: Number(parts.at(-1)),
    };
}

function isDuplicateSpellDC(current: iDC[], candidate: iDC): boolean {
    return current.some(
        dc => dc.type === candidate.type &&
              dc.name === candidate.name &&
              dc.keyAttr === candidate.keyAttr &&
              dc.proficiency === candidate.proficiency
    );
}

function toProfEnum(n: number): proficiencyLevel {
    const map: Record<number, proficiencyLevel> = {
        2: proficiencyLevel.Trained,
        4: proficiencyLevel.Expert,
        6: proficiencyLevel.Master,
        8: proficiencyLevel.Legendary,
    };
    return map[n] ?? proficiencyLevel.Untrained;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function updateCharacter(char: iCharacter, pbChar: iPBChar): iCharacter {
    const build = pbChar.build;

    // Basic info
    char.name = build.name;
    char.class = build.class;
    char.level = build.level;
    char.keyAbility = build.keyability as Attribute;

    // Protection
    char.protection.ac = build.acTotal.acTotal;
    char.protection.shield = Number(build.acTotal.shieldBonus);

    // Attributes (ability scores → modifiers)
    for (const key of Object.values(Attribute)) {
        char.attributes[key] = toModValue(build.abilities[key]);
    }

    // Proficiencies
    for (const profKey of Object.keys(build.proficiencies)) {
        if (profKey in char.proficiencies) {
            const from = profKey as keyof iPBProficiencies;
            const to = profKey as keyof iProficiencies;
            char.proficiencies[to] = toProfEnum(build.proficiencies[from]);
        }
    }

    // Untrained Improvisation feat
    char.untrainedImprovisation = build.feats.some(feat => feat[0] === "Untrained Improvisation");

    // Resistances
    char.resistances = build.resistances.map(parseResistance);

    // Lores (sorted alphabetically)
    char.lores = build.lores
        .map((pbLore): iLore => ({
            name: String(pbLore[0]),
            proficiency: toProfEnum(Number(pbLore[1])),
            item: 0,
        }))
        .sort((a, b) => capitalize(a.name) > capitalize(b.name) ? 1 : -1);

    // Spell DCs + Shield cantrip detection
    char.spellDCs = [];
    for (const caster of build.spellCasters) {
        const newDC: iDC = {
            name: capitalize(caster.magicTradition),
            keyAttr: caster.ability as Attribute,
            type: "spell",
            proficiency: toProfEnum(caster.proficiency),
            item: 0,
        };

        if (isDuplicateSpellDC(char.spellDCs, newDC)) {
            console.warn("Duplicated Spell DC", newDC);
        } else {
            char.spellDCs.push(newDC);
        }

        const hasShield = caster.spells
            .filter(s => s.spellLevel === 0)
            .some(s => s.list.includes("Shield"));
        if (hasShield) {
            char.protection.shield = Math.max(char.protection.shield, 1);
        }
    }

    // Item bonuses from mods
    for (const mod in build.mods) {
        const itemBonus = build.mods[mod]?.["Item Bonus"];
        if (itemBonus !== undefined) {
            const key = mod.toLowerCase();
            if (key in char.item) {
                char.item[key as keyof typeof char.item] = itemBonus;
            }
        }
    }

    // Languages
    char.languages = build.languages;

    return char;
}

export async function loadFromPB(jsonId: string): Promise<iPBChar | null> {
    const url = `https://pathbuilder2e.com/json.php?id=${jsonId}`;
    try {
        const response = await fetch(url);
        return await response.json() as iPBChar;
    } catch (e) {
        console.error("Failed to fetch from Pathbuilder:", e);
        return null;
    }
}
