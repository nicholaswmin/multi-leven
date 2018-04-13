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

## Tests

```bash
$ npm test
```

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin]

## License

MIT

[nicholaswmin]: https://github.com/nicholaswmin
