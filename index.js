'use strict'

const Worker = require('tiny-worker')

class MultiLeven {
  constructor (entries, { workersNum }) {
    this._splitEntries = this._chunk(entries, workersNum)
    this._workers = this._splitEntries.map(() => new Worker('worker.js'))
  }

  init () {
    const jobs = this._workers.map((worker, i) => {
      return this._addEntriesToWorker(worker, this._splitEntries[i])
    })

    return Promise.all(jobs).then(() => {
      this._splitEntries = []

      return true
    })
  }

  search (name) {
    const jobs = this._workers.map((worker, i) => {
      return this._runSearchInWorker(worker, name)
    })

    return Promise.all(jobs).then(result => {
      return result.filter(result => result)
        .reduce((arr, result ) => arr.concat(result), [])
    })
  }

  _addEntriesToWorker (worker, entries) {
    return new Promise(resolve => {
      worker.onmessage = e => {
        if (e.data.type === 'entries-added') {
          resolve()
        }
      }

      worker.postMessage({
        type: 'add-entries',
        entries
      })
    })
  }

  _runSearchInWorker (worker, name) {
    return new Promise(resolve => {
      worker.onmessage = e => {
        if (e.data.type === 'search-completed') {
          resolve(e.data.results)
        }
      }

      worker.postMessage({
        type: 'run-search',
        name
      })
    })
  }

  _chunk (array, parts) {
    if (parts < array.length && array.length > 1 && array != null) {
      const newArray = []

      let counter1 = 0
      let counter2 = 0

      while (counter1 < parts) {
        newArray.push([])
        counter1 += 1
      }

      for (let i = 0; i < array.length; i++) {
        newArray[counter2++].push(array[i])

        if (counter2 > parts - 1) {
          counter2 = 0
        }
      }

      return newArray
    } else {
      return array
    }
  }
}

module.exports = MultiLeven
