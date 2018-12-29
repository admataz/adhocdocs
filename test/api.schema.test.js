const request = require('request')
const { expect } = require('chai')
const testSchema = require('./fixtures/schema')
const { server: config } = require('../server/config')

const baseUrl = `http://localhost:${config.port}`

describe.only('create new schema', () => {
  it('should create a new schema', done => {
    request.post({ url: `${baseUrl}/api/v1/schema`, body: testSchema, json: true }, (err, res, body) => {
      if (err) throw (err)
      expect(res.statusCode).equal(201)
      done()
    })
  })
})
