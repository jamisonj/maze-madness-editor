/**
 * editorSettings.ts: reducer for updating the current state of the editor.
 * Editor state encompasses properties such as display, edit mode, etc.
 */

export enum EntityDisplayMode {
    Shown = "Shown",
    SemiTransparent = "SemiTransparent",
    Grayscale = "Grayscale",
    Hidden = "Hidden",
    Highlighted = "Highlighted"
};

export enum LevelLayer {
    Lower = "lower",
    Upper = "upper",
    Background = "background"
};

export enum EditorMode {
    DeletingLower = "DeletingLower",
    SettingLower = "SettingLower",
    SettingWall = "SettingWall",
    DeletingUpper = "DeletingUpper",
    SettingUpper = "SettingUpper",
    History = "History",
    Validate = "Validate"
};

export type EditorState = {
    display: {
        lower: EntityDisplayMode;
        upper: EntityDisplayMode;
        background: EntityDisplayMode;
    };
    mode: EditorMode;
    selectedSquare?: [number, number];
    currentItem: number;
};

export enum EditorActions {
    SetDisplayMode = "SetDisplayMode",
    SetEditMode = "SetEditMode",
    SelectSquare = "SelectSquare",
    SetCurrentItem = "SetCurrentItem"
};

export type EditorSetDisplayModeAction = {
    type: EditorActions.SetDisplayMode;
    layer: LevelLayer;
    mode: EntityDisplayMode;
};

export type EditorSetModeAction = {
    type: EditorActions.SetEditMode;
    mode: EditorMode;
};

export type EditorSelectSquareAction = {
    type: EditorActions.SelectSquare;
    square?: [number, number];
};

export type EditorSetCurrentItemAction = {
    type: EditorActions.SetCurrentItem;
    item: number;
};

export const KELP_SEED = 1;
export const AUTO_WALL = -1;
export const LOCK_SINGLE_WALL = -2;
export const UNLOCK_SINGLE_WALL = -3;
export const DELETE = -4;
export const PIPE_SQUARE = -5;

export type EditorAction = EditorSetDisplayModeAction | EditorSetModeAction | EditorSelectSquareAction | EditorSetCurrentItemAction;

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case EditorActions.SetEditMode:
            return {
                ...state,
                mode: action.mode,
                currentItem: action.mode === EditorMode.SettingWall ? AUTO_WALL : KELP_SEED
            };
        case EditorActions.SetDisplayMode:
            return {
                ...state,
                display: {
                    ...state.display,
                    [action.layer]: action.mode
                }
            };
        case EditorActions.SelectSquare:
            return {
                ...state,
                selectedSquare: action.square
            };
        case EditorActions.SetCurrentItem:
            return {
                ...state,
                currentItem: action.item
            };
    }
}

export function initialEditorState() {
    return {
        display: {
            lower: EntityDisplayMode.Shown,
            upper: EntityDisplayMode.Shown,
            background: EntityDisplayMode.Shown
        },
        mode: EditorMode.History,
        currentItem: KELP_SEED
    };
}
