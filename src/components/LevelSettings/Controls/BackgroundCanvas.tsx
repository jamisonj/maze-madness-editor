/**
 * BackgroundCanvas.tsx: an individual canvas for selecting a new background for a room. Displays a snippet of the background.
 * The border is a different color if the canvas is selected.
 */

import { useRef } from "react";
import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { useBackgroundCanvasDraw } from "./hooks";

export type BackgroundCanvasProps = {
    index: number;
    onClick: () => void;
    foregroundColor: string;
};

const BackgroundCanvas: React.FC<BackgroundCanvasProps>
    = ({ index, onClick, foregroundColor }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        useBackgroundCanvasDraw(canvasRef, index, foregroundColor);
        return (
            <canvas
                width={SQUARE_SIZE * 0.8}
                height={SQUARE_SIZE * 0.8}
                ref={canvasRef}
                style={{ cursor: "pointer" }}
                onClick={onClick}
            />
        );
    };
export default BackgroundCanvas;
