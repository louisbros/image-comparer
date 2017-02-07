import { ComparatorPred } from './comparator';
import { PixelProcessor } from "./processor";
import { Comparison, Comparer } from "./comparer";

export interface BuilderAPI {
    withProcessor: (value: PixelProcessor) => BuilderAPI;
    withComparator: (value: ComparatorPred) => BuilderAPI;
    compare: (imgBuffA: Buffer, imgBuffB: Buffer) => Promise<Comparison>
}

export function create() {
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

export { Processor } from "./processor";
export { Comparator } from "./comparator";
export { ImageUtil } from "./image";
