'use strict'

const chai = require('chai')
const testData = require('./test-data')
const MultiLeven = require('../index.js')

chai.should()

const entries = testData({
  howMany: 4000000,
  needle: 'Nicholas Ioannis Kyriakides'
})

describe('Process on (1) worker', () => {
  const searcher = new MultiLeven(entries, { workersNum: 1 })

  describe('#init', () => {
    it('initializes', () => {
      return searcher.init()
    })
  })

  describe('#search', () => {
    it('finds a result', () => {
      return searcher.search('Nikolas Ioannis Kyriakides')
        .then(results => {
          results.should.have.length(2)
          results[0].should.equal('Nicholas Ioannis Kyriakides')
          results[1].should.equal('Nicholas Ioannis Kyriakides')
        })
    })
  })
})

describe('Process on (4) workers', () => {
  const searcher = new MultiLeven(entries, { workersNum: 4 })

  describe('#init', () => {
    it('initializes', () => {
      return searcher.init()
    })
  })

  describe('#search', () => {
    it('finds a result', () => {
      return searcher.search('Nikolas Ioannis Kyriakides')
        .then(results => {
          results.should.have.length(2)
          results[0].should.equal('Nicholas Ioannis Kyriakides')
          results[1].should.equal('Nicholas Ioannis Kyriakides')
        })
    })
  })
})
