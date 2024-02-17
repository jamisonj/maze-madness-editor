/**
 * hooks.ts: hooks related to level setting controls.
 */

import { useCallback, useContext } from "react";
import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { PaletteContext } from "../../../palette/PaletteProvider";
import { useCanvasDraw } from "../../LevelGrid/hooks";

export function useBackgroundCanvasDraw(canvasRef: React.RefObject<HTMLCanvasElement>, background: number, foregroundColor: string) {
    const {backgrounds} = useContext(PaletteContext);
    const draw = useCallback((context: CanvasRenderingContext2D) => {
        context.strokeStyle = foregroundColor;
        context.lineWidth = 3;
        context.drawImage(backgrounds.canvasAt(background), 0, 0, 100, 100);
        context.strokeRect(0, 0, SQUARE_SIZE * 0.8, SQUARE_SIZE * 0.8);
    }, [background, foregroundColor, backgrounds]);
    useCanvasDraw(canvasRef, draw);
}
