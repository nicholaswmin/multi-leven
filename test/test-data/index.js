'use strict'

const dedent = require('dedent')

const lengthInUtf8MB = str => {
  return parseInt((Buffer.from(str).length / 1024) / 1024)
}

module.exports = ({
  howMany,
  needle = 'John Doe',
  haystack = 'Claus Phillip Maria Schenk Graff von Stauffenberg',  }) => {

    const samples = [needle]

    for (let i = 0; i < howMany - 2; i++) {
      samples.push(haystack)
    }

    samples.push(needle)

    console.log(
      dedent`
      Creating ${samples.length} input items,
      equalling ${lengthInUtf8MB(JSON.stringify(samples))} MB's of test data.
      `
    )

    return samples
}
