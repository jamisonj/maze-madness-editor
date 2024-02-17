/**
 * level.ts: reducer for updating the state of a single room of a level.
 */

import { WallPalette } from "../constants/walls";
import { Palette } from "../palette/Palette";

/**
 * Represents the current state of a single room of a single level.
 * @member lower the current items in the lower level of the given room.
 * @member upper the current decorations in the upper level of the given room.
 * @member background code representing the background image of the given room.
 * @member smartWallMask whether or not each position should conform to surrounding walls when they change.
 * @member palette index representing the palette to be used for walls and decorations.
 */
export type LevelState = {
    lower: number[][];
    upper: number[][];
    background: number;
    smartWallMask: boolean[][];
    palette: WallPalette;
};

export enum LevelActions {
    SetItem = "LEVEL_SET_ITEM",
    SetSmartWall = "LEVEL_SET_SMART_WALL",
    SetDecoration = "LEVEL_SET_DECORATION",
    SetBackground = "LEVEL_SET_BACKGROUND",
    SetPalette = "LEVEL_SET_PALETTE",
    Clear = "LEVEL_CLEAR",
    SetWallsSmart = "LEVEL_SET_WALLS_SMART",
    SetWallsNotSmart = "LEVEL_SET_WALLS_NOT_SMART",
    CompleteWallBorder = "COMPLETE_WALL_BORDER"
};

export enum LevelClearTarget {
    Items = "Items",
    Walls = "Walls",
    Decorations = "Decorations"
};

export type LevelSetItemAction = {
    type: LevelActions.SetItem;
    x: number;
    y: number;
    item: number;
    palette: Palette;
};

export type LevelSetSmartWallAction = {
    type: LevelActions.SetSmartWall;
    x: number;
    y: number;
    smart?: boolean;
    squarePipe?: boolean;
    palette: Palette;
};

export type LevelSetDecorationAction = {
    type: LevelActions.SetDecoration;
    x: number;
    y: number;
    decoration: number;
};

export type LevelSetPaletteAction = {
    type: LevelActions.SetPalette;
    wallPalette: WallPalette;
    palette: Palette;
};

export type LevelSetBackgroundAction = {
    type: LevelActions.SetBackground;
    background: number;
};

export type LevelClearAction = {
    type: LevelActions.Clear;
    target: LevelClearTarget;
    palette: Palette;
};

export type LevelSetAllWallsSmart = {
    type: LevelActions.SetWallsSmart;
    palette: Palette;
};

export type LevelSetAllWallsNotSmart = {
    type: LevelActions.SetWallsNotSmart;
};

export type LevelCompleteWallBorder = {
    type: LevelActions.CompleteWallBorder;
    palette: Palette;
}

export type LevelAction
    = LevelClearAction | LevelSetBackgroundAction | LevelSetPaletteAction | LevelSetDecorationAction | LevelSetItemAction | LevelSetSmartWallAction | LevelSetAllWallsNotSmart | LevelSetAllWallsSmart | LevelCompleteWallBorder;

export function set<T>(values: T[][], target: T, x: number, y: number) {
    const newValues = [...values];
    newValues[x] = [...values[x]];
    newValues[x][y] = target;
    return newValues;
}

function adjacentWalls(values: number[][], x: number, y: number, palette: Palette): string {
    let result: string = "";
    if (palette.isWall(values[x][y + 1])) result += "D";
    if (palette.isWall(values[x - 1] && values[x - 1][y])) result += "L";
    if (palette.isWall(values[x + 1] && values[x + 1][y])) result += "R";
    if (palette.isWall(values[x][y - 1])) result += "U";
    return result;
}

function empty<T>(values: T[][], value: T): T[][] {
    return values.map(v => v.map(() => value));
}

function map2d<T>(values: T[][], f: (value: T) => T): T[][] {
    return values.map(v => v.map(f));
}

function zeros(width: number, height: number): number[][] {
    const r: number[][] = [];
    for (let x = 0; x < width; ++x) {
        const rr: number[] = [];
        for (let y = 0; y < height; ++y) rr.push(0);
        r.push(rr);
    }
    return r;
}

export function walls(lower: number[][], palette: Palette): boolean[][] {
    return lower.map(col => col.map(value => palette.isWall(value) && !palette.isCave(value)));
}

export function initialLevelState(data: ArrayBuffer, wallPalette: WallPalette, palette: Palette): LevelState {
    const view = new DataView(data);
    const lower = zeros(16, 11);
    const upper = zeros(16, 11);
    for (let x = 0; x < 16; ++x) {
        for (let y = 0; y < 11; ++y) {
            lower[x][y] = view.getUint16((y * 16 + x) * 2, true);
            upper[x][y] = view.getUint16((y * 16 + x) * 2 + 354, true);
        }
    }
    return {
        lower,
        upper,
        background: view.getUint16(352, true),
        palette: wallPalette,
        smartWallMask: walls(lower, palette)
    };
}

function isBorder(x: number, y: number): boolean {
    return x === 0 || x === 15 || y === 0 || y === 10;
}

function updateSmartWalls(lower: number[][], smartWallMask: boolean[][], x: number, y: number, palette: Palette, wallPalette: WallPalette) {
    
    // check to left and right
    if (x > 0 && smartWallMask[x - 1][y]) {
        lower[x - 1] = [...lower[x - 1]];
        lower[x - 1][y] = palette.chooseWall(wallPalette, adjacentWalls(lower, x - 1, y, palette), isBorder(x - 1, y) && wallPalette === WallPalette.Pipes);
    }
    if (x < lower.length - 1 && smartWallMask[x + 1][y]) {
        lower[x + 1] = [...lower[x + 1]]
        lower[x + 1][y] = palette.chooseWall(wallPalette, adjacentWalls(lower, x + 1, y, palette), isBorder(x + 1, y) && wallPalette === WallPalette.Pipes);
    }

    // check above and below
    if (y > 0 && smartWallMask[x][y - 1])
        lower[x][y - 1] = palette.chooseWall(wallPalette, adjacentWalls(lower, x, y - 1, palette), isBorder(x, y - 1) && wallPalette === WallPalette.Pipes);
    if (y < lower[0].length - 1 && smartWallMask[x][y + 1])
        lower[x][y + 1] = palette.chooseWall(wallPalette, adjacentWalls(lower, x, y + 1, palette), isBorder(x, y + 1) && wallPalette === WallPalette.Pipes);

}

export function levelReducer(state: LevelState, action: LevelAction): LevelState {

    switch (action.type) {

        case LevelActions.CompleteWallBorder:

            // create copy and update at selected position
            const cNewLower = [...state.lower];
            const newSmartWalls = [...state.smartWallMask];
            const isBonusBorder = state.palette === WallPalette.Pipes;

            // upper and lower broders for all x
            for (let x = 0; x < 16; ++x) {
                cNewLower[x] = [...cNewLower[x]];
                newSmartWalls[x] = [...newSmartWalls[x]];
                if (!action.palette.isWall(cNewLower[x][0])) {
                    cNewLower[x][0] = action.palette.chooseWall(state.palette, x === 0 || x === 15 ? "DLRU" : "LRU", isBonusBorder);
                    newSmartWalls[x][0] = true;
                    updateSmartWalls(cNewLower, state.smartWallMask, x, 0, action.palette, state.palette);
                }
                if (!action.palette.isWall(cNewLower[x][10])) {
                    cNewLower[x][10] = action.palette.chooseWall(state.palette, x === 0 || x === 15 ? "DLRU" : "DLR", isBonusBorder);
                    newSmartWalls[x][10] = true;
                    updateSmartWalls(cNewLower, state.smartWallMask, x, 10, action.palette, state.palette);
                }
            }

            // left and right borders for all y
            for (let y = 0; y < 11; ++y) {
                if (!action.palette.isWall(cNewLower[0][y])) {
                    cNewLower[0][y] = action.palette.chooseWall(state.palette, y === 0 || y === 10 ? "DLRU" : "DLU", isBonusBorder);
                    newSmartWalls[0][y] = true;
                    updateSmartWalls(cNewLower, state.smartWallMask, 0, y, action.palette, state.palette);
                }
                if (!action.palette.isWall(cNewLower[15][y])) {
                    cNewLower[15][y] = action.palette.chooseWall(state.palette, y === 0 || y === 10 ? "DLRU" : "DRU", isBonusBorder);
                    newSmartWalls[15][y] = true;
                    updateSmartWalls(cNewLower, state.smartWallMask, 15, y, action.palette, state.palette);
                }
            }

            // update
            return {
                ...state,
                lower: cNewLower,
                smartWallMask: newSmartWalls
            };

        case LevelActions.SetSmartWall:
            
            // if locking (smart wall false) simply set at the given index
            if (action.smart === false)
                return {
                    ...state,
                    smartWallMask: set(state.smartWallMask, false, action.x, action.y)
                };

            // create copy and update at selected position
            const newLower = [...state.lower];
            const bonusBorder = isBorder(action.x, action.y) && state.palette === WallPalette.Pipes;
            newLower[action.x] = [...newLower[action.x]];
            newLower[action.x][action.y] = action.palette.chooseWall(state.palette, adjacentWalls(state.lower, action.x, action.y, action.palette), bonusBorder || action.squarePipe);
            updateSmartWalls(newLower, state.smartWallMask, action.x, action.y, action.palette, state.palette);

            // update
            return {
                ...state,
                lower: newLower,
                smartWallMask: set(state.smartWallMask, action.squarePipe ? false : true, action.x, action.y)
            };

        case LevelActions.SetWallsNotSmart:
            return {
                ...state,
                smartWallMask: empty(state.smartWallMask, false)
            };

        case LevelActions.SetWallsSmart:
            return {
                ...state,
                smartWallMask: walls(state.lower, action.palette)
            };

        case LevelActions.SetItem:
            const cLower = set(state.lower, action.item, action.x, action.y);
            if (action.palette.isWall(action.item) || action.palette.isWall(state.lower[action.x][action.y]))
                updateSmartWalls(cLower, state.smartWallMask, action.x, action.y, action.palette, state.palette);
            return {
                ...state,
                lower: cLower,
                smartWallMask: set(state.smartWallMask, false, action.x, action.y)
            };
        
        case LevelActions.SetBackground:
            return {
                ...state,
                background: action.background
            };
        
        case LevelActions.SetDecoration:
            return {
                ...state,
                upper: set(state.upper, action.decoration, action.x, action.y)
            };
        
        case LevelActions.Clear:
            if (action.target === LevelClearTarget.Items)
                return {
                    ...state,
                    lower: map2d(state.lower, x => action.palette.isWall(x) ? x : 0)
                };
            else if (action.target === LevelClearTarget.Walls)
                return {
                    ...state,
                    lower: map2d(state.lower, x => action.palette.isWall(x) ? 0 : x),
                    smartWallMask: empty(state.smartWallMask, false)
                };
            else
                return {
                    ...state,
                    upper: empty(state.upper, 0)
                };
        
        case LevelActions.SetPalette:
            return {
                ...state,
                palette: action.wallPalette,
                lower: state.lower.map((col, x) => col.map((item, y) => (
                    state.smartWallMask[x][y]
                        ? action.palette.chooseWall(action.wallPalette, adjacentWalls(state.lower, x, y, action.palette), isBorder(x, y) && action.wallPalette === WallPalette.Pipes)
                        : item
                )))
            };
        
    }
}
