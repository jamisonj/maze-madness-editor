/**
 * LevelGrid.tsx: the level editor grid.
 */

import React, { useCallback, useContext, useRef } from 'react';

import { GRID_HEIGHT, GRID_WIDTH, SQUARE_SIZE, drawGrid, drawLower, drawUpper } from './draw';
import { useCanvasDraw, useLevelGridMouseHandler } from './hooks';
import { PaletteContext } from '../../palette/PaletteProvider';
import { EditorStateContext, LevelSetStateContext } from '../../reducers';
import { useCurrentRoom } from '../Editor/hooks';

/**
 * Handles a mouse click on a LevelGrid canvas; converts mouse coordinates to grid coordinates and calls the provided callback.
 * @param e mouse click event.
 * @param handler callback which updates the level state; receives x and y coordinates in squares from the top left of the grid.
 * @param componentRef React reference to the HTML canvas element.
 */
function mouseHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>, handler: (x: number, y: number) => void, componentRef: React.RefObject<HTMLCanvasElement>) {
    if (!componentRef.current) return;
    const rect = componentRef.current?.getBoundingClientRect();
    handler(
        Math.floor((e.clientX - rect.left) / SQUARE_SIZE),
        Math.floor((e.clientY - rect.top) / SQUARE_SIZE)
    );
}

/**
 * The LevelGrid visualizes the level room currently being visualized. Clicking on the grid performs updates to the level according
 * to the current editor mode.
 * @returns React component containing a div element with a child canvas containing the level grid.
 */
const LevelGrid: React.FC
    = () => {

        // get state and dispatchers
        const [levelSetState, levelSetDispatch] = useContext(LevelSetStateContext);
        const [editorState] = useContext(EditorStateContext);
        const roomState = useCurrentRoom(levelSetState);

        // load item, decoration, and background palettes, and create click handler
        const { lower: palette, upper: upperPalette, backgrounds } = useContext(PaletteContext);
        const clickHandler = useLevelGridMouseHandler(editorState, levelSetDispatch);

        // draw the current state on the grid
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const draw = useCallback((context: CanvasRenderingContext2D) => {
            drawGrid(context, backgrounds.canvasAt(roomState.background), editorState.display.background);
            drawLower(context, roomState, editorState, palette);
            drawUpper(context, roomState, editorState, upperPalette);
        }, [roomState, palette, upperPalette, backgrounds, editorState]);
        useCanvasDraw(canvasRef, draw);
        
        return (
            <div className="level-grid-container">
                <canvas
                    ref={canvasRef}
                    width={GRID_WIDTH}
                    height={GRID_HEIGHT}
                    onClick={e => mouseHandler(e, clickHandler, canvasRef)}
                    className="level-grid"
                />
            </div>
        );

    };
export default LevelGrid;
