/**
 * palette.ts: URLs for palette images and data
 */

import { UpperPaletteOffset } from "../palette/Palette";
import { UPPER_PALETTE_COORDINATES } from "./upper";
import { WALL_INDEXES, WALL_ORIENTATIONS, WallPalette } from "./walls";

/**
 * Represents a set of walls of a particular style.
 * @member orientations maps strings to arrays of uint16s representing walls in that orientation. Keys encode directions in which the wall
 * *contacts* another wall (e.g., "DL" is a wall contacting walls down and to the left, but not up or to the right).
 * @member indexes set of all uint16s which are walls for this collection.
 * @member palette the unique index of this wall palette.
 */
export type WallSet = {
    orientations: {[key: string]: number[]};
    indexes: Set<number>;
    palette: WallPalette;
};

/**
 * List of palette URLs for walls and items. Each contains an image URL, binary data URL, and wall style object in that order. For consistency
 * with upper palette URLs, there is a fourth entry for each item which is unused.
 */
export const PALETTE_URLS = [
    [`${process.env.PUBLIC_URL}/assets/images/core-set-cropped.png`, `${process.env.PUBLIC_URL}/assets/bin/core-sets.bin`],
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ([
        `${process.env.PUBLIC_URL}/assets/images/walls-${i}.png.cropped.png`,
        `${process.env.PUBLIC_URL}/assets/bin/walls-${i}.bin`,
        { indexes: WALL_INDEXES[i - 1], orientations: WALL_ORIENTATIONS[i - 1], palette: i } as WallSet,
        i
    ])),
] as [string, string, WallSet, number][];

/**
 * List of palette URLs for decorations. Each contains an image URL, binary data URL, and decoration offset/dimension array, and wall palette index
 * in that order.
 */
export const UPPER_PALETTE_URLS = (() => (
    Object.keys(UPPER_PALETTE_COORDINATES).map(url => ([
        `${process.env.PUBLIC_URL}/assets/images/upper/${url}.png`,
        `${process.env.PUBLIC_URL}/assets/bin/upper/upper-${url}.bin`,
        UPPER_PALETTE_COORDINATES[url],
        url.includes("global") ? -1 : +url.split("-")[0]
    ]))
))() as [string, string, UpperPaletteOffset[], number][];
