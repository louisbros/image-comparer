import { expect } from 'chai';
import { ImageComparer, Processor, Comparator } from "../../src/index";
import { Pixel, Point } from '../../src/image';
const fs = require('fs');

describe('comparer', () => {
    var comparer;

    beforeEach(() => {
        comparer = ImageComparer.create()
            .withProcessor(Processor['PIXEL']())
            .withComparator(Comparator['RGBA_PCT'](0.4));
    });

    describe('points', () => {
        it('should ', () => {
            const expectedPoints = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 }
            ];
            const points = [];

            comparer = comparer.withComparator((pixelA: Pixel, pixelB: Pixel, point: Point) => points.push(point));
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/points.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/points.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then(() => expect(points).to.deep.equal(expectedPoints));
        });
    });

    describe('bounds', () => {

        it('should report the correct dimensions', () => {
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/bounds-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/bounds-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then(comparison => {
                    expect(comparison.bounds).to.deep.equal({
                        t: 6,
                        l: 1,
                        b: 8,
                        r: 6
                    });
                });
        });
    });

    describe('pct', () => {

        it('should report the correct percent of difference', () => {
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/pct-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/pct-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then(comparison => expect(comparison.pct).to.equal(0.25));
        });
    });

    describe('mean pixel', () => {

        it('should remove noise from the image', () => {
            comparer = comparer.withProcessor(Processor['MEAN_PIXEL']())
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/mean-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/mean-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then(comparison => {
                    expect(comparison.bounds).to.deep.equal({
                        t: 15,
                        l: 14,
                        b: 17,
                        r: 16
                    });

                    expect(comparison.pct).to.equal(0.01)
                });
        });

        it('should not wrap the pixel neibourhood', () => {
            comparer = comparer.withProcessor(Processor['MEAN_PIXEL']())
                .withComparator(Comparator['RGBA_PCT'](0.1));
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/edge-bounds-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/edge-bounds-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then(comparison => {
                    expect(comparison.bounds).to.deep.equal({
                        t: 1,
                        l: 0,
                        b: 3,
                        r: 1
                    });
                });
        });
    });
});