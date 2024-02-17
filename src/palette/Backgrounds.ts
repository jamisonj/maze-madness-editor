/**
 * Backgrounds.ts: canvases containing map backgrounds.
 */

import { loadImage } from "./hooks";

export class Backgrounds {

    private canvases: HTMLCanvasElement[];
    private width: number;
    private height: number;

    constructor() {
        this.canvases = [];
        this.width = 0;
        this.height = 0;
    }

    async appendBackground(index: number) {
        const [canvas, width, height] = await loadImage(`assets/images/backgrounds/${index}.png`);
        this.canvases[index] = canvas;
        this.width = width;
        this.height = height;
    }

    canvasAt(index: number) {
        return this.canvases[index];
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    count() {
        return this.canvases.length;
    }

}
