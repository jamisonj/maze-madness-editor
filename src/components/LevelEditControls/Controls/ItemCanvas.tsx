/**
 * ItemCanvas.tsx: represents a single interactive canvas containing a single item or wall.
 */

import { useRef } from "react";
import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { useItemCanvasDrawing } from "./hooks";

/**
 * Properties of the item canvas component.
 * @member value the uint16 code representing the item or wall.
 * @member onClick callback when the canvas is clicked.
 * @member foregroundColor the color border which should be drawn around the canvas.
 * @member selected if true, this object is selected and will have a more prominent border color.
 * @member scale if provided, the default 40x40 dimensions will be multiplied by this value.
 * @member label if provided, text label to be drawn on the canvas at its center.
 */
type ItemCanvasProps = {
    value: number;
    onClick: () => void;
    foregroundColor: string;
    selected?: boolean;
    scale?: number;
    label?: string;
};

/**
 * Draws an item or wall on a canvas. The item or wall will occupy exactly one square which by default is 40x40 pixels.
 * A zero (empty) or invalid code may be passed, in which case a single empty square will be drawn.
 * 
 * @returns React component containing a single canvas with the decoration drawn.
 */
const ItemCanvas: React.FC<ItemCanvasProps>
    = ({ value, onClick, foregroundColor, selected, scale, label }) => {

        // get scale and create canvas ref
        scale = scale || 1;
        const canvasRef = useRef<HTMLCanvasElement>(null);

        // draw the item
        useItemCanvasDrawing(canvasRef, value, scale, selected ? foregroundColor : undefined, label)
        
        return (
            <canvas
                width={SQUARE_SIZE * scale}
                height={SQUARE_SIZE * scale}
                ref={canvasRef}
                style={{ cursor: "pointer" }}
                onClick={onClick}
            />
        );

    };
export default ItemCanvas;
