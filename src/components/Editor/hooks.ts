/**
 * hooks.ts: hooks for the editor component.
 */

import { useContext, useEffect, useMemo, useReducer } from "react";

import { editorReducer, initialEditorState, initialLevelSetState, levelSetReducer } from "../../reducers";
import { PaletteContext } from "../../palette/PaletteProvider";
import { LevelSetAction, LevelSetActions, LevelSetState, currentState } from "../../reducers/levelSet";

/**
 * Initializes state and creates reducers for the 50-level set and the editor settings.
 * @param data binary data for the 50-level set in .he8 format.
 * @returns object containing level state/reducer and editor state/reducer.
 */
export function useEditorState(data: ArrayBuffer) {
    const { lower: lowerPalette } = useContext(PaletteContext);
    const levelSetStateAndReducer = useReducer(levelSetReducer, initialLevelSetState(data, lowerPalette));
    const editorStateAndReducer = useReducer(editorReducer, initialEditorState());
    return { levelSetStateAndReducer, editorStateAndReducer };
}

/**
 * Handles ctrl+Z and ctrl+shift+Z to trigger undo/redo.
 * @param dispatch dispatcher to update the current state.
 */
export function useUndoKeyboardShortcuts(dispatch: React.Dispatch<LevelSetAction>) {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ')
                dispatch({
                    type: event.shiftKey ? LevelSetActions.RedoLast : LevelSetActions.UndoLast
                });
        }
        document.addEventListener('keypress', handler);
        return () => {
            document.removeEventListener('keypress', handler);
        };
    }, [dispatch]);
}

/**
 * Fetches the state of the room currently being edited.
 * @param state the current state of all 50 levels.
 * @returns the state of the room currently being edited.
 */
export function useCurrentRoom(state: LevelSetState) {
    return useMemo(() => currentState(state.levels[state.selectedLevel][state.selectedRoom])!, [state]);
}
