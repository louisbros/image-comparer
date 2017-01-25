import { Comparator, ComparatorPred } from './comparator';
import { ImageUtil } from "./image";

type Bounds = {
    t: number;
    l: number;
    b: number;
    r: number;
};

type Comparison = {
    pct: number;
    bounds: Bounds;
    buffer: Buffer;
};

function compare(imgBuffA: Buffer, imgBuffB: Buffer, comparatorPred: ComparatorPred): Promise<Comparison> {
    return Promise.all([
        ImageUtil.bufferToImageData(imgBuffA),
        ImageUtil.bufferToImageData(imgBuffB)
    ]).then(([imageDataA, imageDataB]) => {

        const bounds: Bounds = {
            t: imageDataA.height / 2,
            l: imageDataA.width / 2,
            b: imageDataA.height / 2,
            r: imageDataA.width / 2
        };

        let diffCount = 0;

        for (let i = 0; i < imageDataA.data.length; i += 4) {
            const point = ImageUtil.getPoint(i, imageDataA.width);
            const pixelA = ImageUtil.getPixelAt(imageDataA, i);
            const pixelB = ImageUtil.getPixelAt(imageDataB, i);

            if (comparatorPred(pixelA, pixelB, point)) {
                diffCount++;

                bounds.t = Math.min(point.y, bounds.t);
                bounds.l = Math.min(point.x, bounds.l);
                bounds.b = Math.max(point.y, bounds.b);
                bounds.r = Math.max(point.x, bounds.r);

                ImageUtil.setPixelAt(imageDataB, i, {
                    r: 255,
                    g: 0,
                    b: 0
                });
            }
        }

        const pct = diffCount / (imageDataA.data.length / 4);

        return ImageUtil.imageDataToBuffer(imageDataB)
            .then((buffer) => ({ pct, bounds, buffer }));
    });
}

module.exports = {
    compare,
    Comparator
};
