import { Comparator, ComparatorPred } from './comparator';
import { Processor, PixelProcessor } from "./processor";
import { ImageUtil } from "./image";
import { Comparison, Comparer } from "./comparer";

export interface BuilderAPI {
    withProcessor: (value: PixelProcessor) => BuilderAPI;
    withComparator: (value: ComparatorPred) => BuilderAPI;
    compare: (imgBuffA: Buffer, imgBuffB: Buffer) => Promise<Comparison>
}

function create() {
    let pixelProcessor: PixelProcessor;
    let comparatorPred: ComparatorPred;

    function withProcessor(value: PixelProcessor) {
        pixelProcessor = value;
        return this;
    }

    function withComparator(value: ComparatorPred) {
        comparatorPred = value;
        return this;
    }

    function compare(imgBuffA: Buffer, imgBuffB: Buffer) {
        return Comparer.compare(imgBuffA, imgBuffB, pixelProcessor, comparatorPred);
    }

    return <BuilderAPI>{
        withProcessor,
        withComparator,
        compare
    };
}

module.exports = {
    create,
    Processor,
    Comparator,
    ImageUtil
};
