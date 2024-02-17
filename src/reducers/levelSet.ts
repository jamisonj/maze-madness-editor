/**
 * levelSet.ts: state for a full 50-level set
 */

import { WallPalette } from "../constants/walls";
import { Palette } from "../palette/Palette";
import { LevelAction, LevelState, initialLevelState, levelReducer, set } from "./level";

export enum LevelSetActions {
    SelectLevel = "SelectLevel",
    ResetLevel = "ResetLevel",
    UndoLast = "UndoLast",
    RedoLast = "RedoLast",
    Open = "Open"
};

type LevelSetOpenAction = {
    type: LevelSetActions.Open;
    buffer: ArrayBuffer;
    palette: Palette;
};

type LevelSetUndoAction = {
    type: LevelSetActions.UndoLast;
};

type LevelSetRedoAction = {
    type: LevelSetActions.RedoLast;
};

type LevelSetResetAction = {
    type: LevelSetActions.ResetLevel;
};

type LevelSetSelectAction = {
    type: LevelSetActions.SelectLevel;
    level: number;
    room: number;
};

export type LevelSetAction = LevelAction | LevelSetUndoAction | LevelSetRedoAction | LevelSetResetAction | LevelSetSelectAction | LevelSetOpenAction;

export type LevelRoom = {
    data: ArrayBuffer;
    stateHistory: LevelState[] | undefined;
    statePointer: number;
};

export type SingleLevelState = [
    LevelRoom,
    LevelRoom,
    LevelRoom,
    LevelRoom,
    LevelRoom,
    LevelRoom
];

export type LevelSetState = {
    levels: SingleLevelState[];
    selectedLevel: number;
    selectedRoom: number;
    palette: Palette;
};

export function currentState(room: LevelRoom): LevelState | undefined {
    const history = room.stateHistory;
    if (!history) return;
    return history[room.statePointer];
}

function updateCurrentLevel(state: LevelSetState, newLevelState: Partial<LevelRoom>): SingleLevelState[] {
    const newLevel = {
        ...state.levels[state.selectedLevel][state.selectedRoom],
        ...newLevelState
    };
    return set(state.levels, newLevel, state.selectedLevel, state.selectedRoom) as SingleLevelState[];
}

export function levelSetReducer(state: LevelSetState, action: LevelSetAction): LevelSetState {
    
    const newState = {...state};
    const currentPointer = state.levels[state.selectedLevel][state.selectedRoom].statePointer;

    switch (action.type) {
        
        case LevelSetActions.Open:
            return initialLevelSetState(action.buffer, action.palette);

        // changing which level is displayed in the editor; if not yet parsed from raw data, it is loaded here
        case LevelSetActions.SelectLevel:
            newState.selectedLevel = action.level;
            newState.selectedRoom = action.room;
            if (newState.levels[newState.selectedLevel][newState.selectedRoom].stateHistory === undefined) {
                const data = state.levels[action.level][action.room].data;
                newState.levels = updateCurrentLevel(newState, {
                    stateHistory: [initialLevelState(
                        data,
                        state.palette.paletteFromLower(data) || WallPalette.GrayStone,
                        state.palette
                    )]
                });
            }
            return newState;

        // resets the selected level/room to its initial state
        case LevelSetActions.ResetLevel:
            newState.levels = updateCurrentLevel(state, {
                statePointer: 0
            });
            return newState;

        // undoes the last edit to the selected level/room; no-op if no previous edits are available
        case LevelSetActions.UndoLast:
            newState.levels = updateCurrentLevel(state, {
                statePointer: currentPointer === 0 ? 0 : currentPointer - 1
            });
            return newState;
        
        // redoes the last undone edit to the selected level/room; no-op if no previous undone edits are available
        case LevelSetActions.RedoLast:
            const historyLength = state.levels[state.selectedLevel][state.selectedRoom].stateHistory!.length;
            newState.levels = updateCurrentLevel(state, {
                statePointer: currentPointer === historyLength - 1 ? currentPointer : currentPointer + 1
            });
            return newState;
        
        // handles any individual edit to the selected level/room, such as placing or deleting an item
        default:
            const currentHistory = state.levels[state.selectedLevel][state.selectedRoom].stateHistory!;
            const currentState = currentHistory[currentPointer];
            newState.levels = updateCurrentLevel(state, {
                stateHistory: [
                    ...currentHistory.slice(0, currentPointer + 1),
                    levelReducer(currentState, action)
                ],
                statePointer: currentPointer + 1
            });
            return newState;

    }

}

export function initialLevelSetState(data: ArrayBuffer, palette: Palette): LevelSetState {
    let currentPointer = 0;
    const levelStates: SingleLevelState[] = [];
    for (let level = 0; level < 50; ++level) {
        const newLevelState: LevelRoom[] = [];
        for (let room = 0; room < 6; ++room) {
            newLevelState.push({
                data: data.slice(currentPointer, currentPointer + 706),
                statePointer: 0,
                stateHistory: undefined
            });
            currentPointer += 706;
        }
        levelStates.push(newLevelState as SingleLevelState);
    }
    levelStates[0][0].stateHistory = [initialLevelState(
        levelStates[0][0].data,
        palette.paletteFromLower(data) || WallPalette.GrayStone,
        palette
    )];
    return {
        levels: levelStates,
        palette,
        selectedLevel: 0,
        selectedRoom: 0
    };
}
