# image-comparer

## Compare two image buffers in node

```js
ImageComparer.create()
    .withProcessor(ImageComparer.Processor.MEAN_PIXEL())
    .withComparator(ImageComparer.Comparator.RGBA_PCT(0.2))
    .compare(imgBufA, imgBufB)
    .then((comparison) => {
        console.log(comparison.pct, comparison.bounds, comparison.time);
    });
```

### Processors

```js
PIXEL // an unprocessed pixel
MEAN_PIXEL // the mean of a 3*3 pixel neighbourhood
```

### Comparators

```js
RGBA_PCT(pct: number) // true if the percentage of difference between the RGBA values of two pixels is greater than the given pct
```

### Comparison

```js
{
    pct: number; // percentage of change
    bounds: { // bounds of change within image
        t: number;
        l: number;
        b: number;
        r: number;
    };
    buffer: Buffer; // image highlighting the change
    time: number; // time taken to compare in millis
}
```