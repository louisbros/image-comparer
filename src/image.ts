import * as imageType from 'image-type';
import * as JPG from 'jpeg-js';
import { PNG } from 'pngjs';

export const PIXEL_LENGTH = 4;

export type Pixel = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type Point = {
    x: number;
    y: number;
};

function readJPG(imgBuff: Buffer): Promise<ImageData> {
    return Promise.resolve(JPG.decode(imgBuff));
}

function readPNG(imgBuff: Buffer): Promise<ImageData> {
    return new Promise((resolve, reject) => {
        new PNG({ filterType: 4 }).parse(imgBuff, (error, data) => {
            if (error != null) {
                return reject(error);
            }
            resolve(data);
        });
    });
}

function bufferToImageData(imgBuff: Buffer): Promise<ImageData> {
    const type = imageType(imgBuff);

    if (type.mime === 'image/jpeg') {
        return readJPG(imgBuff);
    }

    if (type.mime === 'image/png') {
        return readPNG(imgBuff)
    }

    throw new Error(`Unexpected image type: (.${type.ext}, ${type.mime})`)
}

function getPoint(i: number, width: number): Point {
    return {
        x: i / PIXEL_LENGTH % width,
        y: Math.floor(i / PIXEL_LENGTH / width)
    };
}

function getPixelAt({ data }: ImageData, i: number): Pixel {
    return {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3]
    };
}

function setPixelAt({ data }: ImageData, i: number, pixel: Pixel) {
    data[i] = pixel.r;
    data[i + 1] = pixel.g;
    data[i + 2] = pixel.b;
    data[i + 3] = pixel.a;
}

function getPixelNeighbourhood(imageData: ImageData, i: number) {
    const w = imageData.width * PIXEL_LENGTH;
    const prevRow = i - w;
    const nextRow = i + w;

    const indexes = [
        prevRow - PIXEL_LENGTH,
        prevRow,
        prevRow + PIXEL_LENGTH,
        i - PIXEL_LENGTH,
        i,
        i + PIXEL_LENGTH,
        nextRow - PIXEL_LENGTH,
        nextRow,
        nextRow + PIXEL_LENGTH
    ];

    const pixels = [];

    for (var j = 0, l = indexes.length; j < l; j++) {
        const index = indexes[j];

        if (index >= 0 && index < imageData.data.length) {
            pixels.push(getPixelAt(imageData, index))
        }
    }

    return pixels;
}

export const ImageUtil = {
    bufferToImageData,
    getPoint,
    getPixelAt,
    setPixelAt,
    getPixelNeighbourhood
};
