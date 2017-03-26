import { expect } from 'chai';
import { ImageComparer, Processor, Comparator } from "../../src/index";
const fs = require('fs');

describe('comparer', () => {
    var comparer;

    beforeEach(() => {
        comparer = ImageComparer.create()
            .withProcessor(Processor['PIXEL']())
            .withComparator(Comparator['RGBA_PCT'](0.4));
    });

    describe('bounds', () => {

        it('should report the correct dimensions', () => {
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/bounds-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/bounds-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then((comparison) => {
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
                .then((comparison) => expect(comparison.pct).to.equal(0.25));
        });
    });

    describe('buffer', () => {

        it('should report the correct percent of difference', () => {
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/bounds-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/bounds-b.png'));
            const imgBufC = Buffer.from(fs.readFileSync('test/resources/bounds-c.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then((comparison) => expect(comparison.buffer.equals(imgBufC)).to.equal(true));
        });
    });

    describe('mean pixel', () => {

        it('should remove noise from the image', () => {
            comparer = comparer.withProcessor(Processor['MEAN_PIXEL']());
            const imgBufA = Buffer.from(fs.readFileSync('test/resources/mean-a.png'));
            const imgBufB = Buffer.from(fs.readFileSync('test/resources/mean-b.png'));

            return comparer.compare(imgBufA, imgBufB)
                .then((comparison) => {
                    expect(comparison.bounds).to.deep.equal({
                        t: 15,
                        l: 14,
                        b: 17,
                        r: 16
                    });

                    expect(comparison.pct).to.equal(0.01)
                });
        });
    });
});