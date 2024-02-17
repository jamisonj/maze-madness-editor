/**
 * hooks.ts: React hooks related to level edit controls.
 */

import { RefObject, useCallback, useContext, useMemo } from "react";
import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { PaletteContext } from "../../../palette/PaletteProvider";
import { ThemeContext } from "../../../theme/ThemeProvider";
import { useCanvasDraw } from "../../LevelGrid/hooks";

/**
 * Draws a level decoration on a canvas given a uint16 code.  If the code is zero (empty) or invalid, an empty square will be drawn.
 * @param canvasRef React reference to the canvas on which to draw.
 * @param value the uint16 code corresponding to the decoration.
 * @param scale if set, multiplies default 40x40 dimensions of each square by this number.
 * @param borderColor if set, the border color to draw.
 * @returns width and height of the canvas as a two-item array.
 */
export function useDecorationCanvasDrawing(canvasRef: RefObject<HTMLCanvasElement>, value: number, scale?: number, borderColor?: string): [number, number] {
    
    scale = scale || 1;
    const theme = useContext(ThemeContext);

    // get palette and extract decoration image
    const { upper: palette } = useContext(PaletteContext);
    const tile = useMemo(() => palette.tileAtIndex(value), [palette, value]);
    const offset = useMemo(() => palette.offsetsAtIndex(value) || [0, 0, 1, 1, 0, 0], [palette, value]);

    // draw
    const draw = useCallback((context: CanvasRenderingContext2D) => {

        // compute the full size and fill the canvas with the background color
        const width = offset[2] * SQUARE_SIZE;
        const height = offset[3] * SQUARE_SIZE;
        context.fillStyle = theme.secondary;
        context.fillRect(0, 0, width, height);

        // if this is a valid decoration, draw it
        if (tile)
            context.drawImage(tile, 1, 1, width, height, 1, 1, width * scale!, height * scale!);

        // draw the grid
        for (let x = 0; x < offset[2]; ++x) {
            for (let y = 0; y < offset[3]; ++y) {
                context.strokeStyle = borderColor || theme.foreground;
                context.lineWidth = (x === (offset[4] || 0) && y === (offset[5] || 0)) ? 4 : 0.5; // anchor square border is thicker
                context.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE * scale!, SQUARE_SIZE * scale!);
            }
        }

    }, [tile, borderColor, offset, theme, scale]);
    useCanvasDraw(canvasRef, draw);

    // return dimensions
    return [offset[2], offset[3]];

}

/**
 * Draws an item or wall on a canvas given a uint16 code.  If the code is zero (empty) or invalid, an empty square will be drawn.
 * @param canvasRef React reference to the canvas on which to draw.
 * @param value the uint16 code corresponding to the decoration.
 * @param scale if set, multiplies default 40x40 dimensions of the drawing by this number.
 * @param borderColor if set, the border color to draw.
 * @param label if set, text label to draw on the center of the canvas.
 */
export function useItemCanvasDrawing(canvasRef: RefObject<HTMLCanvasElement>, value: number, scale?: number, borderColor?: string, label?: string) {

    scale = scale || 1;
    const theme = useContext(ThemeContext);

    // get palette and extract item image
    const { lower: palette } = useContext(PaletteContext);
    const tile = useMemo(() => palette.tileAtIndex(value), [palette, value]);

    const draw = useCallback((context: CanvasRenderingContext2D) => {

        // fill the canvas with the background color
        context.fillStyle = theme.secondary;
        context.fillRect(0, 0, SQUARE_SIZE, SQUARE_SIZE);

        // if this is a valid item, draw it
        if (tile)
            context.drawImage(tile, 1, 1, SQUARE_SIZE, SQUARE_SIZE, 1, 1, SQUARE_SIZE * scale!, SQUARE_SIZE * scale!);
        
        // draw the border and label
        context.strokeStyle = borderColor || theme.foreground;
        context.lineWidth = 3;
        context.strokeRect(0, 0, SQUARE_SIZE * scale!, SQUARE_SIZE * scale!);
        context.lineWidth = 1;
        if (label) context.strokeText(label, 16, 24, 12);

    }, [tile, borderColor, label, theme, scale]);
    useCanvasDraw(canvasRef, draw);

}
