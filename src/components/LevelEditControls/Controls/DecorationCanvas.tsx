/**
 * DecorationCanvas.tsx: represents a single interactive canvas used to select a decoration to place on the level.
 */

import { useRef } from "react";

import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { useDecorationCanvasDrawing } from "./hooks";

/**
 * Properties of the decoration canvas component.
 * @member value the uint16 code representing the decoration.
 * @member onClick callback when the canvas is clicked.
 * @member foregroundColor the color border which should be drawn around the canvas.
 * @member selected if true, this object is selected and will have a more prominent border color.
 * @member scale if provided, the default 40x40 dimensions will be multiplied by this value.
 */
type DecorationCanvasProps = {
    value: number;
    onClick: () => void;
    foregroundColor: string;
    selected?: boolean;
    scale?: number;
};

/**
 * Draws a decoration on a canvas. The decoration will occupy one or more squares which by default are 40x40 pixels. One square
 * is the "anchor" square which corresponds to the clicked square when placing the decoration; this is highlighted with a thicker
 * border. The canvas will automatically resize to the correct dimensions for the decoration.
 * 
 * A zero (empty) or invalid code may be passed, in which case a single empty square will be drawn.
 * 
 * @returns React component containing a single canvas with the decoration drawn.
 */
const DecorationCanvas: React.FC<DecorationCanvasProps>
    = ({ value, onClick, foregroundColor, selected, scale }) => {

        // get scale and create canvas ref
        scale = scale || 1;
        const canvasRef = useRef<HTMLCanvasElement>(null);

        // draw the decoration
        const [ width, height ] = useDecorationCanvasDrawing(canvasRef, value, scale, selected ? foregroundColor : undefined);

        return (
            <canvas
                width={SQUARE_SIZE * width}
                height={SQUARE_SIZE * height}
                ref={canvasRef}
                style={{ cursor: "pointer", marginRight: "1.5em" }}
                onClick={onClick}
            />
        );

    };
export default DecorationCanvas;
