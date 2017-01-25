# image-comparer

### Compare two image buffers in node

    ImageComparer.compare(imgBufA, imgBufB, ImageComparer.Comparator.RGB_PCT(0.5))

### Returns

    {
        pct: number; // percentage of pixel change
        bounds: Bounds; // bounds of change within image
        buffer: Buffer; // image with change highlighted
    }
