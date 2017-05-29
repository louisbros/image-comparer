import { ComparatorPred } from './comparator';
import { PixelProcessor } from './processor';
import { ImageUtil, Point, PIXEL_LENGTH } from './image';

export type Bounds = {
    t: number;
    l: number;
    b: number;
    r: number;
};

export type Comparison = {
    pct: number;
    bounds: Bounds;
    time: number;
};

function range(len, setp, func: (i: number) => any) {
    for (var i = 0; i < len; i += setp) {
        func(i);
    }
}

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

function compareImageData(imageDataA: ImageData, imageDataB: ImageData, pixelProcessor: PixelProcessor, comparatorPred: ComparatorPred) {
    const start = Date.now();
    const w = Math.min(imageDataA.width, imageDataB.width);
    const h = Math.min(imageDataA.height, imageDataB.height);

    var diffCount = 0;
    var bounds = createBounds(w, h);
    range(w * h * PIXEL_LENGTH, PIXEL_LENGTH, i => {
        const point = ImageUtil.getPoint(i, w);
        const pixelA = pixelProcessor(imageDataA, i);
        const pixelB = pixelProcessor(imageDataB, i);

        if (comparatorPred(pixelA, pixelB, point)) {
            diffCount++;
            updateBounds(bounds, point);
        }
    });

    return Promise.resolve({
        pct: diffCount / (imageDataA.data.length / 4),
        bounds,
        time: Date.now() - start
    });
}

function compare(imgBuffA: Buffer, imgBuffB: Buffer, pixelProcessor: PixelProcessor, comparatorPred: ComparatorPred): Promise<Comparison> {
    return Promise.all([
        ImageUtil.bufferToImageData(imgBuffA),
        ImageUtil.bufferToImageData(imgBuffB)
    ]).then(([imageDataA, imageDataB]) => compareImageData(imageDataA, imageDataB, pixelProcessor, comparatorPred));
}

export const Comparer = {
    compare
};
