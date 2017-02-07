import { ComparatorPred } from './comparator';
import { PixelProcessor } from "./processor";
import { ImageUtil, Point } from "./image";

const MAGENTA = {
    r: 255,
    g: 0,
    b: 255,
    a: 255
};

export type Bounds = {
    t: number;
    l: number;
    b: number;
    r: number;
};

export type Comparison = {
    pct: number;
    bounds: Bounds;
    buffer: Buffer;
    time: number;
};

function createBounds(width: number, height: number): Bounds {
    return {
        t: height,
        l: width,
        b: 0,
        r: 0
    };
}

function updateBounds(bounds: Bounds, point: Point) {
    bounds.t = Math.min(point.y, bounds.t);
    bounds.l = Math.min(point.x, bounds.l);
    bounds.b = Math.max(point.y, bounds.b);
    bounds.r = Math.max(point.x, bounds.r);
}

function compare(imgBuffA: Buffer, imgBuffB: Buffer, pixelProcessor: PixelProcessor, comparatorPred: ComparatorPred): Promise<Comparison> {
    const start = Date.now();
    var diffCount = 0;

    return Promise.all([
        ImageUtil.bufferToImage(imgBuffA),
        ImageUtil.bufferToImage(imgBuffB)
    ]).then(([imageA, imageB]) => {
        const w = Math.min(imageA.width, imageB.width);
        const h = Math.min(imageA.height, imageB.height);

        const bounds = createBounds(w, h);

        const imageDataA = ImageUtil.getImageData(imageA, w, h);
        const imageDataB = ImageUtil.getImageData(imageB, w, h);
        const imageDataC = ImageUtil.createImageData(w, h);

        for (var i = 0, l = imageDataC.data.length; i < l; i += 4) {
            const point = ImageUtil.getPoint(i, w);
            const pixelA = pixelProcessor(imageDataA, i);
            const pixelB = pixelProcessor(imageDataB, i);

            if (comparatorPred(pixelA, pixelB, point)) {
                diffCount++;
                updateBounds(bounds, point);
                ImageUtil.setPixelAt(imageDataC, i, MAGENTA);
            }
        }

        return ImageUtil.imageDataToBuffer(imageDataC)
            .then((buffer) => ({
                pct: diffCount / (imageDataA.data.length / 4),
                bounds,
                buffer,
                time: Date.now() - start
            }));
    });
}

export const Comparer = {
    compare
};
