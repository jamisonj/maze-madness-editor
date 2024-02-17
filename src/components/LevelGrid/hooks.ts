/**
 * hooks.ts: hooks for use with the LevelGrid component.
 */

import React, { useContext, useEffect } from 'react';
import { AUTO_WALL, DELETE, EditorMode, EditorState, LOCK_SINGLE_WALL, PIPE_SQUARE, UNLOCK_SINGLE_WALL } from '../../reducers/editorSettings';
import { LevelAction, LevelActions } from '../../reducers/level';
import { PaletteContext } from '../../palette/PaletteProvider';

type CanvasDrawFunction = (context: CanvasRenderingContext2D) => void;

/**
 * Draws on a canvas once it has loaded.
 * @param canvas the canvas on which to draw.
 * @param paint callback which draws on the canvas; called when the canvas has loaded.
 */
export function useCanvasDraw(canvas: React.RefObject<HTMLCanvasElement>, paint: CanvasDrawFunction) {
    useEffect(() => {
        if (canvas === null || canvas.current === null) return;
        const context = canvas.current.getContext('2d');
        if (context !== null) return paint(context);
    }, [canvas, paint]);
}

/**
 * Creates a callback which a component can use to update the current state when a square in the level editor is clicked.
 * @param editorState current state of the editor.
 * @param dispatch React reducer function to udpdate the 50 level-set.
 * @returns callback which updates the current state given clicked (x, y) coordinates.
 */
export function useLevelGridMouseHandler(editorState: EditorState, dispatch: React.Dispatch<LevelAction>) {
    const {lower: palette} = useContext(PaletteContext);
    return React.useCallback((x: number, y: number) => {
        if (x < 0 || y < 0 || x > 15 || y > 10) return; // prevent out of bounds events
        switch (editorState.mode) {
            case EditorMode.SettingLower:
            case EditorMode.SettingWall:
                if (editorState.currentItem === AUTO_WALL)
                    dispatch({
                        type: LevelActions.SetSmartWall,
                        x,
                        y,
                        palette
                    });
                else if (editorState.currentItem === LOCK_SINGLE_WALL || editorState.currentItem === UNLOCK_SINGLE_WALL)
                    dispatch({
                        type: LevelActions.SetSmartWall,
                        x,
                        y,
                        palette,
                        smart: editorState.currentItem === UNLOCK_SINGLE_WALL
                    });
                else if (editorState.currentItem === PIPE_SQUARE)
                    dispatch({
                        type: LevelActions.SetSmartWall,
                        x,
                        y,
                        palette,
                        squarePipe: true
                    });
                else if (editorState.currentItem === DELETE)
                    dispatch({
                        type: LevelActions.SetItem,
                        x,
                        y,
                        palette,
                        item: 0
                    });
                else
                    dispatch({
                        type: LevelActions.SetItem,
                        x,
                        y,
                        palette,
                        item: editorState.currentItem
                    });
                break;
            case EditorMode.DeletingLower:
                dispatch({
                    type: LevelActions.SetItem,
                    x,
                    y,
                    palette,
                    item: 0
                });
                break;
            case EditorMode.DeletingUpper:
                dispatch({
                    type: LevelActions.SetDecoration,
                    x,
                    y,
                    decoration: 0
                });
                break;
            case EditorMode.SettingUpper:
                dispatch({
                    type: LevelActions.SetDecoration,
                    x,
                    y,
                    decoration: editorState.currentItem
                });
        }
    }, [dispatch, editorState, palette]);
}
