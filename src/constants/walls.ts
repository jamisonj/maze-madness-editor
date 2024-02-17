/**
 * walls.ts: constants related to wall segments for each set and their orientations.
 */

/**
 * Indexes corresponding to distinct level styles.
 */
export enum WallPalette {
    PurpleCoral = 1,
    FadedKelp = 2,
    BlueStone = 3,
    ShipWreck = 4,
    BrightKelp = 5,
    FloodedMine = 6,
    Pipes = 7,
    PaleStone = 8,
    BrownStone = 9,
    BlueCoral = 10,
    GrayStone = 11
};

/**
 * Stores lists of wall orientations for each wall set palette. Each palette occupies a single index. The
 * corresponding dictionaries map orientation keys to lists of indexes in the corresponding palette.
 * 
 * A given wall's orientation represents the directions where that wall segment *contacts* another wall. For
 * example, 'DU' represents a wall segment which contacts walls both down and up but not to the left or right.
 * 
 * Palette indexes begin with 0 at the upper left corner and progress to the right across the rows.
 */
export const WALL_ORIENTATIONS = [
   
    // wall group 1: purple coral, original game levels 41-45
    {
        DU: [0, 29, 30],
        LR: [1, 9, 31, 32, 33],
        RU: [2, 18],
        DL: [3, 15],
        LU: [4, 17],
        DR: [5, 16],
        DRU: [6, 20, 36],
        DLU: [7, 19, 38],
        LRU: [8, 23, 42],
        DLR: [22, 34],
        DLRU: [10, 21, 39, 40, 41],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [25]
    },

    // wall group 2: faded kelp, original game levels 36-40
    {
        DU: [0, 29, 30],
        LR: [1, 31, 32],
        RU: [2, 18],
        DL: [3, 15],
        LU: [4, 17],
        DR: [5, 16],
        DRU: [6, 20, 35],
        DLU: [7, 19, 37],
        LRU: [8, 23, 41, 42],
        DLR: [9, 22, 33, 34],
        DLRU: [10, 21, 36, 39, 40],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [25]
    },

    // wall group 3: blue stone, original game levels 16-20
    {
        DU: [0, 29, 30],
        LR: [1, 31, 32],
        RU: [2, 18],
        DL: [3, 15],
        LU: [4, 17],
        DR: [5, 16],
        DRU: [6, 20, 36, 35],
        DLU: [7, 19, 38, 37],
        LRU: [8, 23, 41, 42],
        DLR: [9, 22, 33, 34],
        DLRU: [10, 21, 39, 40],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [25]
    },

    // wall group 4: wood, original game levels 21-25
    {
        DU: [0, 29, 30],
        LR: [1, 31],
        RU: [2],
        DL: [3, 15],
        LU: [4],
        DR: [5, 16],
        DRU: [6, 20, 35, 36],
        DLU: [7, 19, 37, 38],
        DLRU: [10, 21, 23, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49],
        DLR: [9, 32, 33, 22, 34],
        L: [11, 17],
        R: [12, 18],
        U: [13],
        D: [14],
        "": [24],
        LRU: [8, 42],
        I: [25]
    },

    // wall group 5: bright kelp, original game levels 6-10
    {
        DU: [0, 29, 30],
        RU: [1, 21],
        LR: [2, 31, 32],
        DLU: [3, 20, 37, 38],
        DLRU: [4, 19, 39, 40],
        DL: [5, 17],
        LU: [6, 23],
        DRU: [7, 18, 35, 36],
        DR: [8, 15],
        LRU: [9, 41, 42, 22],
        DLR: [10, 16, 33, 34],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [25]
    },

    // wall group 6: gold stone, original game levels 46-50
    {
        DU: [0, 25, 26],
        RU: [1, 21],
        LR: [2, 27, 28],
        DLU: [3, 20, 33, 34],
        DLRU: [4, 19, 35, 36],
        DL: [5, 17],
        LU: [6, 23],
        DRU: [7, 18, 31, 32],
        DR: [8, 15],
        LRU: [9, 22, 37, 38],
        DLR: [10, 16, 29, 30],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [39]
    },

    // wall group 7: pipes, original game bonus rooms
    {
        DU: [0, 26, 27],
        RU: [1],
        LR: [2, 25, 28],
        DLU: [3],
        DLRU: [4, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
        DL: [5],
        LU: [6],
        DRU: [7],
        DR: [8],
        LRU: [9],
        DLR: [10],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [15],
        I: [39]
    },

    // wall group 8: pale stone, original game levels 31-35
    {
        DU: [0, 25, 26],
        RU: [1, 21],
        LR: [2, 27, 28],
        DLU: [3, 20, 33, 34],
        DLRU: [4, 19, 35, 36],
        DL: [5, 17],
        LU: [6, 23],
        DRU: [7, 18, 31, 32],
        DR: [8, 15],
        LRU: [9, 22, 37, 38],
        DLR: [10, 16, 29, 30],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [39],
        I: [24]
    },

    // wall group 9: brown stone, original game levels 26-30
    {
        DU: [0, 25, 26],
        RU: [1, 21],
        LR: [2, 27, 28],
        DLU: [3, 20, 33, 34],
        DLRU: [4, 19, 35, 36],
        DL: [5, 17],
        LU: [6, 23],
        DLR: [10, 16, 29, 30],
        DR: [8, 15],
        LRU: [9, 22, 37, 38],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        DRU: [7, 18, 31, 32],
        "": [24],
        I: [39]
    },

    // wall group 10: blue coral, original game levels 11-15
    {
        DU: [0, 31, 32],
        LR: [1, 29, 30],
        RU: [2, 18],
        DL: [3, 15],
        LU: [4, 17],
        DR: [5, 16],
        DRU: [6, 20, 33, 34],
        DLR: [9, 22, 37, 38],
        LRU: [8, 23, 41, 42],
        DLRU: [10, 21, 39, 40],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        DLU: [7, 19, 35, 36],
        "": [24],
        I: [25]
    },
    
    // wall group 11: gray stone, original game levels 1-5
    {
        DU: [0, 29, 30],
        LR: [1, 31, 32],
        RU: [2, 18],
        DL: [3, 15],
        LU: [4, 17],
        DR: [5, 16],
        DRU: [6, 20, 35],
        DLU: [7, 19, 37],
        LRU: [8, 23, 41, 42],
        DLR: [9, 22, 33, 34],
        DLRU: [10, 21, 36, 38, 39, 40],
        L: [11],
        R: [12],
        U: [13],
        D: [14],
        "": [24],
        I: [25]
    }

] as {[key: string]: number[]}[];

/**
 * Selects a random wall texture from the given wall palette which contacts walls in the given orientation.
 * @param palette the wall palette from which to select the wall.
 * @param orientation string representing the directions in which the wall *contacts* another wall.
 * @returns uint16 code representing the wall.
 */
export function chooseWall(palette: WallPalette, orientation: string): number {
    const walls = WALL_ORIENTATIONS[palette][orientation];
    return walls[Math.floor(Math.random() * walls.length)];
}

/**
 * Array of sets of all uint16s which are walls, one for each wall palette. Order is the same as WALL_ORIENTATIONS.
 */
export const WALL_INDEXES = (() => (
    WALL_ORIENTATIONS.map(v => {
        const indexes: number[] = [];
        Object.keys(v).forEach(k => {
            indexes.push(...v[k]);
        });
        return new Set(indexes);
    })
))();
