# image-comparer

### Compare two image buffers in node

    ImageComparer.create()
        .withProcessor(ImageComparer.Processor.MEAN_PIXEL())
        .withComparator(ImageComparer.Comparator.RGB_PCT(0.4))
        .compare(imgBufA, imgBufB);

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

### Processors

    PIXEL // an unprocessed pixel
    MEAN_PIXEL // the mean of a 3*3 pixel neighbourhood

### Comparators

    RGB_PCT(pct: number) // true if the percentage of difference between the RGB values of two pixels is greater than pct
