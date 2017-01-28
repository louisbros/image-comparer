import { ComparatorPred } from './comparator';
import { PixelProcessor } from "./processor";
import { ImageUtil, Point } from "./image";

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
        t: height / 2,
        l: width / 2,
        b: height / 2,
        r: width / 2
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

    return Promise.all([
        ImageUtil.bufferToImageData(imgBuffA),
        ImageUtil.bufferToImageData(imgBuffB)
    ]).then(([imageDataA, imageDataB]) => {
        const { width, height} = imageDataA;
        const bounds = createBounds(width, height);

        let diffCount = 0;

        for (let i = 0; i < imageDataA.data.length; i += 4) {
            const point = ImageUtil.getPoint(i, width);
            const pixelA = pixelProcessor(imageDataA, i);
            const pixelB = pixelProcessor(imageDataB, i);

            if (comparatorPred(pixelA, pixelB, point)) {
                diffCount++;
                updateBounds(bounds, point);
                ImageUtil.setPixelAt(imageDataB, i, {
                    r: 255,
                    g: 0,
                    b: 0
                });
            }
        }

        const pct = diffCount / (imageDataA.data.length / 4);

        return ImageUtil.imageDataToBuffer(imageDataB)
            .then((buffer) => ({
                pct,
                bounds,
                buffer,
                time: Date.now() - start
            }));
    });
}

export const Comparer = {
    compare
};
