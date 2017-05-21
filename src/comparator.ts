import { Pixel, Point } from "./image";

export type ComparatorPred = (pA: Pixel, pB: Pixel, p: Point) => boolean;
export type Comparator = (...args: any[]) => ComparatorPred;
export type ComparatorMap = { [key: string]: Comparator };

const pctDiff = (a, b) => Math.abs(a - b) / Math.max(a, b);

function rgbaPct(thresholdPct): ComparatorPred {
    return (pixelA: Pixel, pixelB: Pixel, point: Point): boolean => {
        const sumA = pixelA.r + pixelA.g + pixelA.b + pixelA.a;
        const sumB = pixelB.r + pixelB.g + pixelB.b + pixelB.a;
        return pctDiff(sumA, sumB) > thresholdPct;
    }
}

function greyscalePct(thresholdPct): ComparatorPred {
    return (pixelA: Pixel, pixelB: Pixel, point: Point): boolean => {
        const sumA = (pixelA.r + pixelA.g + pixelA.b) / 3;
        const sumB = (pixelB.r + pixelB.g + pixelB.b) / 3;
        return pctDiff(sumA, sumB) > thresholdPct;
    }
}

export const Comparator: ComparatorMap = {
    RGBA_PCT: rgbaPct,
    GREYSCALE_PCT: greyscalePct
};
