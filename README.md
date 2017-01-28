# image-comparer

### Compare two image buffers in node

    ImageComparer.compare(imgBufA, imgBufB, ImageComparer.Comparator.RGB_PCT(0.5))

### Returns

    {
        pct: number; // percentage of change
        bounds: { // bounds of change within image
            t: number;
            l: number;
            b: number;
            r: number;
        };
        buffer: Buffer; // image with change highlighted
        time: number; // time taken to compare in millis
    }
