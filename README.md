# multi-leven
Levenshtein-distance on multiple processes [WIP]

## Installation

TBD

## Usage

```javascript
const MultiLeven = require('multi-leven')

// Ideally, `workersNum` reflects the number of physical cores on your
// system.
const searcher = new MultiLeven(['John', 'Mary', 'Foo', 'Bar', 'Baz'], {
  workersNum: 4
})

searcher.init()
  .then(() => {
    // distance tolerance is hardcode to `3` for now.
    return searcher.runSearch({ name: 'Jonn '})
  })
  .then(result => {
    console.log(results)
  })
  .catch(err => {
    throw err
  })
```

## How it works

The passed input array is split in chunks, equal to the numbers of requested
workers. Each chunk is loaded in it's own worker.

When you `.runSearch(arg)`, it simply fires *simultaneous* requests to search
for the passed name in each worker.

The workers are not terminated when the search completes. They stay up
with their own chunk of the input array waiting for the next search.

## Tests

```bash
$ npm test
```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin]

## License

MIT

[nicholaswmin]: https://github.com/nicholaswmin
