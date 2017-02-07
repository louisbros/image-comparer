import { ImageUtil, Pixel } from "./image";

export type PixelProcessor = (imageData: ImageData, i: number) => Pixel;
export type Processor = (...args: any[]) => PixelProcessor;
export type ProcessorMap = { [key: string]: Function };

function sumPixels(pixels: Pixel[]) {
    const sumPixel = {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    };

    for (var i = 0, l = pixels.length; i < l; i++) {
        sumPixel.r += pixels[i].r;
        sumPixel.g += pixels[i].g;
        sumPixel.b += pixels[i].b;
        sumPixel.a += pixels[i].a;
    }

    return sumPixel;
}

function getMeanPixel(): PixelProcessor {
    return (imageData: ImageData, i: number): Pixel => {
        const pixelNeighbourhood = ImageUtil.getPixelNeighbourhood(imageData, i);
        const totalPixel = sumPixels(pixelNeighbourhood);

        return {
            r: totalPixel.r / pixelNeighbourhood.length,
            g: totalPixel.g / pixelNeighbourhood.length,
            b: totalPixel.b / pixelNeighbourhood.length,
            a: totalPixel.a / pixelNeighbourhood.length
        };
    };
}

export const Processor: ProcessorMap = {
    PIXEL: () => ImageUtil.getPixelAt,
    MEAN_PIXEL: getMeanPixel
};
