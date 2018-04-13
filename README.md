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

// - Invoke `init` only *once*, ideally on system startup.
searcher.init()
  .then(() => {
    // distance tolerance is hardcode to `3` for now.
    return searcher.runSearch({ name: 'Jonn' })
  })
  .then(results => {
    console.log(results) // logs `['John']`
  })
  .catch(err => {
    throw err
  })
```

Ideally, you will invoke `init()` only *once*, on startup. From then on you
can call `runSearch(arg)` as many times as you want.

You should use this tactic because initialisation of very large input arrays
is slow due to [IPC serialisation overhead][ipc-data-sharing-so].

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

## Performance testing

These are some preliminary performance results. More workers predict
better performance.

```
Creating 4000000 input items,
equalling 198 MB's of test data.


  Process on (1) worker
    #init
      ✓ initializes (4488ms)
    #runSearch
      ✓ finds a result (14411ms)

  Process on (4) workers
    #init
      ✓ initializes (3938ms)
    #runSearch
      ✓ finds a result (3940ms)


  4 passing (27s)
```

Tests were run on an iMac 2013, 3.2GHz i5, 8GB RAM running MacOS 10.12.6

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin]

## License

MIT

[nicholaswmin]: https://github.com/nicholaswmin
[ipc-data-sharing-so]: https://stackoverflow.com/a/27327402/1814486
