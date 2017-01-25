const imageType = require('image-type');
const Canvas = require('canvas');
const Image = Canvas.Image;

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

function bufferToImageData(buffer: Buffer): Promise<ImageData> {
    const image = new Image();
    const canvas = new Canvas();

    return new Promise((resolve) => {
        image.onload = () => {
            image.onload = null; // prevent memory leak

            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve(imageData);
        };

        image.src = createDataURL(buffer);
    });
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

function getPoint(i, width): Point {
    return {
        x: i / 4 % width,
        y: Math.floor(i / 4 / width)
    };
}

function getPixelAt(imageDataA, i): Pixel {
    return {
        r: imageDataA.data[i],
        g: imageDataA.data[i + 1],
        b: imageDataA.data[i + 2],
        a: imageDataA.data[i + 3]
    };
}

function setPixelAt(imageData, i, pixel) {
    imageData.data[i] = pixel.r;
    imageData.data[i + 1] = pixel.g;
    imageData.data[i + 2] = pixel.b;
    imageData.data[i + 3] = pixel.a || 255;
}

export const ImageUtil = {
    bufferToImageData,
    imageDataToBuffer,
    getPoint,
    getPixelAt,
    setPixelAt
};

