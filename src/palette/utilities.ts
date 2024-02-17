/**
 * utilities.ts: utilities for drawing images and replacing colors.
 */

type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex: string): RGB {
    const bigint = parseInt(hex.replace(/^#/, ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

export function distance(targetColor: RGB, data: [number, number, number]): number {
    return Math.abs(targetColor.r - data[0]) + Math.abs(targetColor.g - data[1]) + Math.abs(targetColor.b - data[2]);
}

export function colorToTransparentOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {

    // extract data, convert hex string to RGB triple
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const targetColor = hexToRgb(color);

    // Iterate through each pixel and replace matching color with transparency
    for (let i = 0; i < data.length; i += 4)
        if (distance(targetColor, [data[i], data[i + 1], data[i + 2]]) < (color === "#ffffff" ? 1 : 20))
            data[i + 3] = 0; // set alpha to transparent

    // Put the modified image data back to the canvas
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(imageData, 0, 0);

}

export function imgToCanvas(img: HTMLImageElement, transparentColors?: string[]) {
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx === null)
        throw new Error("unable to generate canvas context for image");
    
    // draw the image on the canvas and get image data
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    if (transparentColors) transparentColors.forEach(transparentColor => colorToTransparentOnCanvas(ctx, canvas.width, canvas.height, transparentColor));
    return [canvas, img.width, img.height, ctx] as [HTMLCanvasElement, number, number, CanvasRenderingContext2D];
    
}
