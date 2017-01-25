import { Pixel, Point } from "./image";

export type ComparatorPred = (pA: Pixel, pB: Pixel, p: Point) => boolean;
export type Comparator = (...args: any[]) => ComparatorPred;
export type ComparatorMap = { [key: string]: Comparator };

function rgbPct(thresholdPct): ComparatorPred {
    return (pixelA: Pixel, pixelB: Pixel, point: Point): boolean => {
        const sumA = pixelA.r + pixelA.g + pixelA.b;
        const sumB = pixelB.r + pixelB.g + pixelB.b;
        return Math.abs(sumA - sumB) / Math.max(sumA, sumB) > thresholdPct;
    }
}

export const Comparator: ComparatorMap = {
    RGB_PCT: rgbPct
};
