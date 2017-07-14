import { ImageUtil, Pixel } from "./image";

export type PixelProcessor = (imageData: ImageData, i: number) => Pixel;
export type Processor = (...args: any[]) => PixelProcessor;
export type ProcessorMap = { [key: string]: Function };

export const Processor: ProcessorMap = {
    PIXEL: () => ImageUtil.getPixelAt,
    MEAN_PIXEL: () => ImageUtil.getMeanPixel
};
