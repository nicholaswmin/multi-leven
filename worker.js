'use strict'

const leven = require('leven')

let entries = []

onmessage = ev => {
  switch (ev.data.type) {
    case 'add-entries':
      entries = ev.data.entries

      postMessage({
        type: 'entries-added'
      })
      break;
    case 'run-search':
      const name = ev.data.name
      const results = entries.filter(entry => {
        return leven(entry, name) < 3
      })

      postMessage({
        type: 'search-completed',
        results
      })
      break;
    default:
      throw new Error('Unrecongnized worker event type')
  }
}
