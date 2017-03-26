import { ComparatorPred } from './comparator';
import { PixelProcessor } from "./processor";
import { Comparison, Comparer } from "./comparer";

export interface BuilderAPI {
    withProcessor: (value: PixelProcessor) => BuilderAPI;
    withComparator: (value: ComparatorPred) => BuilderAPI;
    compare: (imgBuffA: Buffer, imgBuffB: Buffer) => Promise<Comparison>
}

function create() {
    var pixelProcessor: PixelProcessor;
    var comparatorPred: ComparatorPred;

    function withProcessor(value: PixelProcessor): BuilderAPI {
        pixelProcessor = value;
        return this;
    }

    function withComparator(value: ComparatorPred): BuilderAPI {
        comparatorPred = value;
        return this;
    }

    function compare(imgBuffA: Buffer, imgBuffB: Buffer): Promise<Comparison> {
        return Comparer.compare(imgBuffA, imgBuffB, pixelProcessor, comparatorPred);
    }

    return <BuilderAPI>{
        withProcessor,
        withComparator,
        compare
    };
}

export { Comparison } from './comparer'
export { Processor } from './processor';
export { Comparator } from './comparator';
export { ImageUtil } from './image';

export const ImageComparer = {
    create
};
