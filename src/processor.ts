import { ImageUtil, Pixel } from "./image";

export type PixelProcessor = (imageData: ImageData, i: number) => Pixel;
export type Processor = (...args: any[]) => PixelProcessor;
export type ProcessorMap = { [key: string]: Function };

function addPixels(pixelA: Pixel, pixelB: Pixel) {
    return {
        r: pixelA.r + pixelB.r,
        g: pixelA.g + pixelB.g,
        b: pixelA.b + pixelB.b,
    };
}

function sumPixels(pixels: Pixel[]) {
    return pixels.reduce(addPixels);
}

function getMeanPixel(): PixelProcessor {
    return (imageData: ImageData, i: number): Pixel => {
        const pixelNeighbourhood = ImageUtil.getPixelNeighbourhood(imageData, i);
        const totalPixel = sumPixels(pixelNeighbourhood);

        return {
            r: totalPixel.r / pixelNeighbourhood.length,
            g: totalPixel.g / pixelNeighbourhood.length,
            b: totalPixel.b / pixelNeighbourhood.length
        };
    };
}

export const Processor: ProcessorMap = {
    PIXEL: ImageUtil.getPixelAt,
    MEAN_PIXEL: getMeanPixel
};
