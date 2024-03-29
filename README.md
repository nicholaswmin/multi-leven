<sub>[Nicholas Kyriakides (@nicholaswmin)](https://github.com/nicholaswmin)  
[Euthor LTD](https://www.euthor.com/)  
Nicosia, Cyprus  
2019.</sub>  

# multi-leven

The [Levenshtein-distance](https://en.wikipedia.org/wiki/Levenshtein_distance) on multiple processes, in [NodeJS](https://nodejs.org/en/about)

A parallelisation of [leven](https://github.com/sindresorhus/leven).

> In information theory, linguistics, and computer science, the Levenshtein distance is a string metric for measuring the difference between two sequences. Informally, the Levenshtein distance between two words is the minimum number of single-character edits (insertions, deletions or substitutions) required to change one word into the other.

This is a working example of a special case of [parallelization](https://en.wikipedia.org/wiki/Parallel_computing), called [Data Parallelism](https://en.wikipedia.org/wiki/Data_parallelism). In single-threaded runtimes (such as NodeJS), short of messing with native C++ NodeJS modules, it is in effect the *only viable* way to perform parallelization of typical fuzzy search algorithms.

This experiment was created to speed up the search process of a proprietary [AML (Anti-Money Laundering)](https://www.imf.org/en/Topics/Financial-Integrity/amlcft#:~:text=Videos%20and%20Events-,Overview,system%20and%20member%20countries'%20economies.) system that fuzzily links customers of financial organisations to entries in [OFAC's Politically-Exposed Persons, Specially Designated Nationals And Blocked Persons/Entities][ofac-lists].

**Warning:** If you're a designer/architect/engineer of an AML/KYC system, please ensure you read the [Warning](#warning-for-use-in-aml-systems) section below.


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

## Warning for use in AML systems
> The following warning pertains only for designers/architects/engineers of AML (Anti-Money Laundering) and KYC (Know Your Customer) systems.
>
> The Levenshtein-distance, in particular, is very widely used in AML systems. This code is experimental and not fit for use as-is in such systems. Even if it was, a robust AML/KYC system should NOT rely on one type of matching algorithm to cross-match persons/entities to blacklisted persons/entities.

This code, as-is, is **NOT** appropriate for use of fuzzy-matching in such systems. First and foremost, it's method of operation is publicly available. Secondly, it's an experiment, it is not designed to adhere to formal matching performance requirements nor does it have a complete and automated test suite to validate its results.

Because of the very sensitive nature of the goals of such systems, you should use a multi-attribute matching mechanism, including the use of extra approximate-string matching algorithms ([Soundex](https://en.wikipedia.org/wiki/Soundex), [Jaro–Winkler distance](https://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance), etc).

There are multiple known instances of bad actors tricking such systems simply by knowing how the screening/matching mechanism of a financial organisation works, in some cases even [the financial organisations themselves trick their own system intentionally](https://www.investopedia.com/stock-analysis/2013/investing-news-for-jan-29-hsbcs-money-laundering-scandal-hbc-scbff-ing-cs-rbs0129.aspx) to allow blacklisted persons and entities; access to the financial system without legal repercussions.

The internal workings of matching mechanisms of AML/KYC systems should be kept confidential and on a [need-to-know](https://en.wikipedia.org/wiki/Need_to_know) basis.

For more information on this topic, the [FATF](https://www.fatf-gafi.org/en/the-fatf.html) has published a paper that lists and describes various methods of designing robust AML/KYC systems. You can find the paper here: [Opportunities and Challenges of New Technologies for AML/CFT](https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Opportunities-Challenges-of-New-Technologies-for-AML-CFT.pdf.coredownload.pdf)

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
[ofac-lists]: https://ofac.treasury.gov/specially-designated-nationals-and-blocked-persons-list-sdn-human-readable-lists
