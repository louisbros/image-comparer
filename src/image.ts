import * as imageType from 'image-type';
import * as JPG from 'jpeg-js';
import { PNG } from 'pngjs';

export const NEIGHBOURHOOD_SIZE = 9;
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

function getNeighbourhoodPixels(imageData: ImageData, i: number) {
    const point = ImageUtil.getPoint(i, imageData.width);
    const tEdge = point.y === 0;
    const lEdge = point.x === 0;
    const bEdge = point.y === imageData.height - 1;
    const rEdge = point.x === imageData.width - 1;
    const w = imageData.width * PIXEL_LENGTH;
    const prevRow = i - w;
    const nextRow = i + w;
    const neighbourhood: Pixel[] = [];

    if (!tEdge && !lEdge) neighbourhood.push(getPixelAt(imageData, prevRow - PIXEL_LENGTH));
    if (!tEdge) neighbourhood.push(getPixelAt(imageData, prevRow));
    if (!tEdge && !rEdge) neighbourhood.push(getPixelAt(imageData, prevRow + PIXEL_LENGTH));
    if (!lEdge) neighbourhood.push(getPixelAt(imageData, i - PIXEL_LENGTH));
    neighbourhood.push(getPixelAt(imageData, i));
    if (!rEdge) neighbourhood.push(getPixelAt(imageData, i + PIXEL_LENGTH));
    if (!bEdge && !lEdge) neighbourhood.push(getPixelAt(imageData, nextRow - PIXEL_LENGTH));
    if (!bEdge) neighbourhood.push(getPixelAt(imageData, nextRow));
    if (!bEdge && !rEdge) neighbourhood.push(getPixelAt(imageData, nextRow + PIXEL_LENGTH));

    return neighbourhood;
}

function getMeanPixel(imageData: ImageData, i: number): Pixel {
    const neighbourhood = getNeighbourhoodPixels(imageData, i);
    const meanPixel = { r: 0, g: 0, b: 0, a: 0 };
    const length = neighbourhood.length;
    var pixel;

    for (var i = 0; i < length; i++) {
        pixel = neighbourhood[i];
        meanPixel.r += pixel.r;
        meanPixel.g += pixel.g;
        meanPixel.b += pixel.b;
        meanPixel.a += pixel.a;
    }

    return {
        r: meanPixel.r / length,
        g: meanPixel.g / length,
        b: meanPixel.b / length,
        a: meanPixel.a / length
    };
}

export const ImageUtil = {
    bufferToImageData,
    getPoint,
    getPixelAt,
    setPixelAt,
    getMeanPixel
};
