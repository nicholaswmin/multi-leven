# multi-leven
[Levenshtein-distance](https://en.wikipedia.org/wiki/Levenshtein_distance) on multiple processes [WIP]

> In information theory, linguistics, and computer science, the Levenshtein distance is a string metric for measuring the difference between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.

This is a working example of a special case of [parallelization](https://en.wikipedia.org/wiki/Parallel_computing), called [Data Parallelism](https://en.wikipedia.org/wiki/Data_parallelism). In single-threaded runtimes (such as NodeJS), short of messing with native C++ NodeJS modules, it is in effect the *only viable* way to perform parallelization of typical fuzzy search algorithms.

This experiment was created to speed up the search process of [Matchmaker](https://github.com/Euthor), a proprietary [Anti-Money Laundering System](https://www.imf.org/en/Topics/Financial-Integrity/amlcft#:~:text=Videos%20and%20Events-,Overview,system%20and%20member%20countries'%20economies.) that fuzzily links customers of financial organisations to entries in [FATF's PEP (Politically-Exposed Persons) and Sanctioned/Blacklisted Persons & Entities](https://www.fatf-gafi.org/en/countries/black-and-grey-lists.html).

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
  .then(() => searcher.search('Jonn'))
  .then(results => {
    console.log(results) // logs `['John']`
  })
```

**Note:** Ideally, you will invoke `init()` only *once*, on startup. From then
on you can call `.search(arg)` as many times as you want.

You should use this tactic because initialisation of very large input arrays
is slow due to [IPC serialisation overhead][ipc-data-sharing-so].

## How it works

The passed input array is split in chunks, equal to the numbers of requested
workers. Each chunk is loaded in it's own worker.

![image](https://live.staticflickr.com/65535/53412264841_bb421d95b7_o.png)


When you `.search(arg)`, it simply fires *simultaneous* requests to search
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
    #search
      ✓ finds a result (14411ms)

  Process on (4) workers
    #init
      ✓ initializes (3938ms)
    #search
      ✓ finds a result (3940ms)


  4 passing (27s)
```

Tests were run on an iMac 2013, 3.2GHz i5, 8GB RAM running MacOS 10.12.6

## Authors

- Nicholas Kyriakides, [@nicholaswmin][nicholaswmin]

## Todos

- [ ] Add `teardown` methods
- [ ] Include difference in each returned match (or pass difference tolerance to filter out irrelevant matches)

## License

> ### MIT License
> Massachusets Institute of Technology, SPDX: MIT
>
> Copyright 2019 Nikolas Kyriakides (@nicholaswmin)
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[nicholaswmin]: https://github.com/nicholaswmin
[ipc-data-sharing-so]: https://stackoverflow.com/a/27327402/1814486
