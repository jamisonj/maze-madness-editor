/**
 * hooks.ts: hooks for loading palette images.
 */

import React, { useEffect } from 'react';

import { Palette, UpperPaletteOffset } from "./Palette";
import { imgToCanvas } from "./utilities";
import { WallSet } from '../constants/palette';
import { Backgrounds } from './Backgrounds';

type CanvasWithDimensions = [HTMLCanvasElement, number, number, CanvasRenderingContext2D];

export async function loadImage(url: string, transparentColors?: string[]): Promise<CanvasWithDimensions> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                resolve(imgToCanvas(img, transparentColors));
            } catch (e) {
                reject(`${e}: image at ${url}`);
            }
        };
        img.onerror = (error) => reject(error);
        img.src = url;
    });
}

async function loadData(image: CanvasWithDimensions, url: string): Promise<[CanvasWithDimensions, ArrayBuffer]> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok)
                    reject(`HTTP error at ${url} code ${response.status}`);
                return response.arrayBuffer();
            })
            .then(data => resolve([ image, data ]))
            .catch(error => reject(`Fetch error for ${url}: ${error}`));
    });
}

function isWallSet(x: WallSet | UpperPaletteOffset[] | undefined): x is WallSet {
    if (x === undefined) return false;
    return (x as WallSet).orientations !== undefined;
}

export function usePalette(urls: [string, string, WallSet | UpperPaletteOffset[], number][], squareSize: number) {
    
    const palette = React.useMemo(() => new Palette(squareSize), [squareSize]);
    const [ progress, setProgress ] = React.useState(0);
    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState<string | null>(null);

    const appendSubPalette = React.useCallback((canvas: CanvasWithDimensions, data: ArrayBuffer, wallSet: WallSet | UpperPaletteOffset[], wallPalette?: number) => {
        const [, width, height, context] = canvas;
        const rows = Math.floor(height / squareSize);
        const cols = Math.floor(width / squareSize);
        const isUpper = wallSet !== undefined && !isWallSet(wallSet);
        palette.appendSubPalette(context, !isUpper ? data : data.slice(354), rows, cols, !isUpper ? undefined : wallSet, !isUpper ? wallSet : undefined, wallPalette);
    }, [palette, squareSize]);

    useEffect(() => {

        if (!urls[progress]) return;
        const [imageUrl, dataUrl, wallSet, wallPalette] = urls[progress];
        const isUpper = wallSet !== undefined && !isWallSet(wallSet);
        setLoading(true);

        loadImage(imageUrl, isUpper ? ["#377bbf", "#ffffff"] : ["#377bbf"])
            .then(canvas => loadData(canvas, dataUrl))
            .then(([ canvas, data ]) => {
                setProgress(progress + 1);
                appendSubPalette(canvas, data, wallSet, wallPalette);
                if (progress + 1 === urls.length) setLoading(false);
            })
            .catch(error => {
                setProgress(-1);
                setError(error);
                setLoading(false);
            });

    }, [urls, progress, appendSubPalette]);

    return { palette, progress, loading, error };
    
}

const BACKGROUNDS = [0, 1, 2, 3, 4, 5, 6, 8, 9];

export function useBackgrounds() {

    const backgrounds = React.useMemo(() => new Backgrounds(), []);
    const [ progress, setProgress ] = React.useState(0);
    const [ loading, setLoading ] = React.useState(false);
    const [ error, setError ] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (progress === BACKGROUNDS.length) return;
        if (!loading) {
            setLoading(true);
            backgrounds.appendBackground(BACKGROUNDS[progress])
                .then(() => { setLoading(false); setProgress(progress + 1); })
                .catch(e => { setError(e); setProgress(BACKGROUNDS.length); setLoading(false); });
        }
    }, [progress, backgrounds, loading]);

    return { backgrounds, loading, progress, error };
    
}
