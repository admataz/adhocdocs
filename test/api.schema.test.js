const request = require('request')
const { expect } = require('chai')
const testSchema = require('./fixtures/schema')
const { server: config } = require('../server/config')

const baseUrl = `http://localhost:${config.port}/api/v1`

describe('schema', () => {
  describe('create schema', () => {
    it('should create a new schema from a valid payload', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(201)
        done()
      })
    })

    it('should not allow duplicate schema IDs', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res2, body) => {
          if (err) throw (err)
          expect(res2.statusCode).equal(500)
          done()
        })
      })
    })

    it('should reject an invalid schema', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.invalidSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(400)
        done()
      })
    })

    it('should reject a schema with no name property defined', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.missingName, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(400)
        done()
      })
    })
  })

  describe('update schema', () => {
    it('should update an existing schema with new properties', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.put({ url: `${baseUrl}/schema/${testSchema.validSchema._id}`, body: testSchema.updateSchemaBody, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(body.value.schema).eql(testSchema.updateSchemaBody)
          expect(body.value._id).equal(testSchema.validSchema._id)
          done()
        })
      })
    })
  })

  describe('delete schema', () => {
    it('should delete an existing schema by id', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.put({ url: `${baseUrl}/schema/${testSchema.validSchema._id}`, body: testSchema.updateSchemaBody, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(body.value.schema).eql(testSchema.updateSchemaBody)
          expect(body.value._id).equal(testSchema.validSchema._id)
          done()
        })
      })
    })
  })

  describe('get schema', () => {
    it('should get an existing schema by schema id', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.get({ url: `${baseUrl}/schema/${testSchema.validSchema._id}`, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(body).to.eql(testSchema.validSchema)
          done()
        })
      })
    })

    it('should return a 404 for a non-existing schema id', done => {
      request.get({ url: `${baseUrl}/schema/non-existent-schema`, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).to.equal(404)
        done()
      })
    })

    it('should get a list of existing schema by schema', done => {
      request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
        if (err) throw (err)
        const validSchema2 = { ...testSchema.validSchema, _id: 'ValidSchema2' }
        request.post({ url: `${baseUrl}/schema`, body: validSchema2, json: true }, (err, res, body) => {
          if (err) throw (err)
          request.get({ url: `${baseUrl}/schema`, json: true }, (err, res, body) => {
            if (err) throw (err)
            expect(body).to.eql([testSchema.validSchema, validSchema2])
            done()
          })
        })
      })
    })
  })
})
