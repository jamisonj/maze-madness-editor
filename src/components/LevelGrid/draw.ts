/**
 * draw.ts: functions for drawing the level grid and associated items.
 */

import { Palette } from "../../palette/Palette";
import { EditorState, EntityDisplayMode } from "../../reducers/editorSettings";
import { LevelState } from "../../reducers/level";

export const SQUARE_SIZE = 40;
const ROW_COUNT = 11;
const COL_COUNT = 16;

export const GRID_WIDTH = SQUARE_SIZE * COL_COUNT;
export const GRID_HEIGHT = SQUARE_SIZE * ROW_COUNT;

const BACKGROUND_COLOR = "#78909c";
const BORDER_COLOR = "#ffffff";

/**
 * Draws grid lines and optionally a background image on the level grid.
 * @param context the canvas drawing context on which to draw.
 * @param backgroundImage if provided, image data to draw on the background prior to drawing the grid.
 * @param backgroundDisplay if provided, display mode for the background, shown or semi-transparent.
 */
export function drawGrid(context: CanvasRenderingContext2D, backgroundImage?: HTMLCanvasElement, backgroundDisplay?: EntityDisplayMode) {

    // clear
    context.clearRect(0, 0, GRID_WIDTH, GRID_HEIGHT);

    // set fill and stroke styles to reflect the background square style
    const priorStroke = [context.strokeStyle, context.lineWidth] as [string, number];
    const priorFill = context.fillStyle;
    context.strokeStyle = BORDER_COLOR;
    context.fillStyle = BACKGROUND_COLOR;
    context.lineWidth = 1;

    // draw background if requested
    if (backgroundImage && backgroundDisplay !== EntityDisplayMode.Hidden) {
        if (backgroundDisplay === EntityDisplayMode.SemiTransparent) context.globalAlpha = 0.5;
        context.drawImage(backgroundImage, 0, 0);
        context.globalAlpha = 1.0;
    }

    // draw the squares
    for (let x = 0; x < GRID_WIDTH; x += SQUARE_SIZE) {
        for (let y = 0; y < GRID_HEIGHT; y += SQUARE_SIZE) {
            if (!backgroundImage) context.fillRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
            context.strokeRect(x, y, SQUARE_SIZE, SQUARE_SIZE);
        }
    }

    // restore prior fill and stroke styles
    [context.strokeStyle, context.lineWidth] = priorStroke;
    context.fillStyle = priorFill;

}

/**
 * Fills the upper corner of a square on the level grid with a triangle; used to indicate locked walls.
 * @param context the canvas context on which to draw the triangle.
 * @param x horizontal position of the triangle, in number of squares from left.
 * @param y vertical position of the triangle, in number of squares from top.
 * @param color optional color to draw; defaults to dark purple.
 */
function fillUpperCorner(context: CanvasRenderingContext2D, x: number, y: number, color?: string) {
    const currentFill = context.fillStyle;
    const points = [[SQUARE_SIZE * (x + 1) - 1, SQUARE_SIZE * y + 1], [SQUARE_SIZE * (x + 1) - 1, SQUARE_SIZE * y + 15], [SQUARE_SIZE * (x + 1) - 15, SQUARE_SIZE * y + 1]];
    context.fillStyle = color || "#880088";
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]); // Starting point (upper right corner)
    context.lineTo(points[1][0], points[1][1]); // Second point (10px away from the corner along the top edge)
    context.lineTo(points[2][0], points[2][1]); // Third point (10px away from the corner along the right edge)
    context.lineTo(points[0][0], points[0][1]);
    context.closePath(); // Connect the last point to the starting point
    context.fill(); // Fill the triangle with the current fill color
    context.fillStyle = currentFill;
}

/**
 * Draws all items and walls on the lower level of the current room.
 * @param context the canvas context on which to draw.
 * @param state current level state containing wall and item data.
 * @param editorState current editor state containing drawing mode for the items and walls.
 * @param palette class instance containing the item and wall images.
 */
export function drawLower(context: CanvasRenderingContext2D, state: LevelState, editorState: EditorState, palette: Palette) {

    // loop columns and rows
    for (let x = 0; x < 16; ++x) {
        for (let y = 0; y < 11; ++y) {

            // extract tile image
            const value = state.lower[x][y];
            const tile = palette.tileAtIndex(value);

            // draw if not hidden; adjust opacity according to mode
            if (tile && editorState.display.lower !== EntityDisplayMode.Hidden) {
                if (editorState.display.lower === EntityDisplayMode.SemiTransparent) context.globalAlpha = 0.5;
                context.drawImage(tile, x * SQUARE_SIZE, y * SQUARE_SIZE);
                context.globalAlpha = 1.0;
            }

            // draw locked wall triangles
            if (palette.isWall(value) && !palette.isCave(value) && !state.smartWallMask[x][y])
                fillUpperCorner(context, x, y);

        }
    }

}

/**
 * Draws all decorations on the upper level of the current room.
 * @param context the canvas context on which to draw.
 * @param state current level state containing decoration data.
 * @param editorState current editor state containing drawing mode for the items and walls.
 * @param palette class instance containing the decoration images.
 */
export function drawUpper(context: CanvasRenderingContext2D, state: LevelState, editorState: EditorState, palette: Palette) {

    // loop columns and rows
    for (let x = 0; x < 16; ++x) {
        for (let y = 0; y < 11; ++y) {

            // extract value and image
            const value = state.upper[x][y];
            const offset = palette.offsetsAtIndex(value);
            const tile = palette.tileAtIndex(value);
            if (!offset) continue;

            // draw decorations according to mode
            // for multi-square decorations (e.g. 2x2, 3x3, etc.) for which the anchor square is *not* the top left, offset variables
            // represent the offset of the anchor square relative to the top left.
            const [,, width, height, xOffset, yOffset] = offset;
            if (tile && editorState.display.upper !== EntityDisplayMode.Hidden) {
                if (editorState.display.upper === EntityDisplayMode.SemiTransparent) context.globalAlpha = 0.5;
                context.drawImage(tile, (x - (xOffset || 0)) * SQUARE_SIZE, (y - (yOffset || 0)) * SQUARE_SIZE);
                context.globalAlpha = 1.0;
            }

            // highlight if requested
            // the anchor square is shaded red; the others have a red border with no shade
            if (editorState.display.upper === EntityDisplayMode.Highlighted) {
                context.strokeStyle = "#ff0000";
                context.strokeRect((x - (xOffset || 0)) * SQUARE_SIZE, (y - (yOffset || 0)) * SQUARE_SIZE, width * SQUARE_SIZE, height * SQUARE_SIZE);
                context.fillStyle = "rgba(200,0,0,0.3)";
                context.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }

        }
    }
}
