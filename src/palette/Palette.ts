/**
 * Palette.ts: a class for interacting with a palette of walls or items stored at a URL.
 */

import { WallSet } from "../constants/palette";
import { WallPalette } from "../constants/walls";
import { iterateLowerValues, iterateUpperValues } from "../data/data";
import { LevelRoom } from "../reducers/levelSet";

export type UpperPaletteOffset = [number, number, number, number] | [number, number, number, number, number, number];

export class Palette {

    private readonly canvases: HTMLCanvasElement[];
    private readonly squareSize: number;
    private indexMap: Map<number, number>;
    private offsetMap: Map<number, UpperPaletteOffset>;
    private wallIndexes: Set<number>;
    private wallOrientations: {[palette: number]: {[key: string]: number[]}};
    private paletteMap: Map<number, WallPalette>;
    private wallSetMap: Map<number | undefined, number[]>;
    private wallPaletteSets: Map<number, number[]>;

    constructor(squareSize: number) {
        this.canvases = [];
        this.squareSize = squareSize;
        this.indexMap = new Map([]);
        this.offsetMap = new Map([]);
        this.wallIndexes = new Set([]);
        this.wallOrientations = {};
        this.paletteMap = new Map([]);
        this.wallSetMap = new Map([]);
        this.wallPaletteSets = new Map([]);
    }
    
    appendSubPalette(ctx: CanvasRenderingContext2D, data: ArrayBuffer, rows: number, cols: number, offsets?: UpperPaletteOffset[], wallSet?: WallSet, wallPalette?: WallPalette) {

        // empty arrays to hold new maps for this sub-palette
        const view = new DataView(data);
        const newIndexes: [number, number][] = [];
        const newPalettes: [number, number][] = [];
        const newCanvases: HTMLCanvasElement[] = [];
        const newOffsets: [number, UpperPaletteOffset][] = [];
        const newWalls: number[] = [];
        let pointer: number = 0;
        const valueOrder: number[] = [];

        // loop through squares
        if (offsets === undefined) {
            [ ...Array(rows) ].forEach((_, y) => {
                [ ...Array(cols) ].forEach((_, x) => {

                    // extract short corresponding to this entry
                    const value = view.getUint16(pointer * 2, true);
                    valueOrder.push(value);
                    newIndexes.push([value, pointer + this.canvases.length]);
                    if (wallSet?.palette || wallPalette !== undefined)
                        newPalettes.push([value, wallSet?.palette || wallPalette!]);
                    if (wallSet?.indexes.has(pointer)) newWalls.push(value);
                    ++pointer;
                    
                    // construct canvas for drawing this image
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    if (context === null) throw new Error(`unable to create context for palette at (${x}, ${y})`);
                    context.putImageData(ctx.getImageData(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize), 0, 0);
                    newCanvases.push(canvas);

                })
            });
        } else {
            offsets.forEach(offset => {

                // extract coordinates, compute pointer in array buffer and extract short
                const [ x, y, width, height, xOffset, yOffset ] = offset;
                const value = view.getUint16((y * 16 + x) * 2, true);
                if (value === 0) return;
                newIndexes.push([value, pointer++ + this.canvases.length]);
                newOffsets.push([value, offset]);
                valueOrder.push(value);
                if (wallPalette !== undefined) newPalettes.push([value, wallPalette]);

                // create canvas with the corresponding image
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (context === null) throw new Error(`unable to create context for palette at (${x}, ${y})`);
                context.putImageData(
                    ctx.getImageData(
                        (x - (xOffset || 0)) * this.squareSize,
                        (y - (yOffset || 0)) * this.squareSize,
                        width * this.squareSize,
                        height * this.squareSize
                    ),
                    0, 0
                );
                newCanvases.push(canvas);

            });

            // update mapping of wall palette to decorations
            if (wallPalette)
                this.wallPaletteSets.set(wallPalette, [...(this.wallPaletteSets.get(wallPalette) || []), ...valueOrder]);

        }

        // update wall orientations
        if (wallSet) {
            this.wallOrientations[wallSet.palette] = {};
            Object.keys(wallSet.orientations).forEach(key => {
                this.wallOrientations[wallSet.palette][key] = wallSet.orientations[key].map(o => valueOrder[o]);
            });
        }

        // update all maps
        this.canvases.push(...newCanvases);
        this.indexMap = new Map([ ...this.indexMap, ...newIndexes ]);
        this.offsetMap = new Map([ ...this.offsetMap, ...newOffsets ]);
        this.wallIndexes = new Set([ ...this.wallIndexes, ...newWalls ]);
        this.paletteMap = new Map([ ...this.paletteMap, ...newPalettes ]);
        this.wallSetMap = new Map([ ...this.wallSetMap, [wallSet?.palette, valueOrder]]);

    }

    tileAtIndex(index: number): HTMLCanvasElement | undefined {
        const i = this.indexMap.get(index);
        return i !== undefined ? this.canvases[i] : undefined;
    }

    isWall(index: number | undefined): boolean {
        return index === undefined || this.wallIndexes.has(index) || this.isCave(index);
    }

    isCave(index: number | undefined): boolean {
        return index !== undefined && index >= 151 && index < 170;
    }

    chooseWall(palette: WallPalette, orientation: string, bonusBorder?: boolean) {
        const walls = this.wallOrientations[palette][bonusBorder ? "DLRU" : orientation];
        if (bonusBorder) return walls[Math.floor(Math.random() * (walls.length - 1)) + 1];
        return walls[Math.floor(Math.random() * walls.length)];
    }

    paletteFromLower(data: ArrayBuffer): WallPalette | undefined {
        const view = new DataView(data);
        for (let x = 0; x < 11 * 16; ++x) {
            const value = view.getUint16(x, true);
            if (this.paletteMap.has(value)) return this.paletteMap.get(value)!;
        }
    }

    palettesFromValues(room: LevelRoom, lower?: boolean): Set<number> {
        const results: number[] = [];
        const iterator = lower ? iterateLowerValues : iterateUpperValues;
        iterator(room, value => {
            if (this.paletteMap.has(value)) results.push(this.paletteMap.get(value)!);
        });
        return new Set(results.filter(value => value !== -1));
    }

    offsetsAtIndex(index: number): UpperPaletteOffset | undefined {
        return this.offsetMap.get(index);
    }

    itemSetAtIndex(index: number | undefined): number[] {
        return this.wallSetMap.get(index) || [];
    }

    wallOrientationMap(palette: WallPalette): {[key: string]: number[]} | undefined {
        return this.wallOrientations[palette];
    }

    decorationsForPalette(wallPalette: WallPalette): number[] {
        return this.wallPaletteSets.get(wallPalette) || [];
    }

}
