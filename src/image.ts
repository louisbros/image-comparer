const imageType = require('image-type');
const Canvas = require('canvas');
const Image = Canvas.Image;

export interface Image {
    width: number;
    height: number;
    src: string;
    onload: Function;
}

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

function createDataURL(buffer): string {
    return 'data:image/' + imageType(buffer) + ';base64,' + buffer.toString('base64');
}

function bufferToImage(buffer: Buffer): Promise<Image> {
    const image: Image = new Image();

    return new Promise((resolve) => {
        image.onload = () => {
            image.onload = null; // prevent memory leak
            resolve(image);
        };

        image.src = createDataURL(buffer);
    });
}

function createContext(width: number, height: number) {
    const canvas = new Canvas();
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext('2d');
}

function createImageData(width: number, height: number) {
    const ctx = createContext(width, height);
    return ctx.getImageData(0, 0, width, height);
}

function getImageData(image: Image, width: number, height: number) {
    const ctx = createContext(width, height);
    ctx.drawImage(image, 0, 0, image.width, image.height);
    return ctx.getImageData(0, 0, width, height);
}

function imageDataToBuffer(imageData): Promise<Buffer> {
    const canvas = new Canvas();
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    let ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    const base64Data = canvas.toDataURL('image/png').split(',')[1];
    return Promise.resolve(Buffer.from(base64Data, 'base64'));
}

function getPoint(i: number, width: number): Point {
    return {
        x: i / 4 % width,
        y: Math.floor(i / 4 / width)
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
    const w = imageData.width * 4;
    const prevRow = i - w;
    const nextRow = i + w;

    const indexes = [
        prevRow - 4,
        prevRow,
        prevRow + 4,
        i - 4,
        i,
        i + 4,
        nextRow - 4,
        nextRow,
        nextRow + 4
    ];

    let pixels = [];

    for (let j = 0; j < indexes.length; j++) {
        let index = indexes[j];

        if (index >= 0 && index < imageData.data.length) {
            pixels.push(getPixelAt(imageData, index))
        }
    }

    return pixels;
}

export const ImageUtil = {
    bufferToImage,
    createImageData,
    getImageData,
    imageDataToBuffer,
    getPoint,
    getPixelAt,
    setPixelAt,
    getPixelNeighbourhood
};
