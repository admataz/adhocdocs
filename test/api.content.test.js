const request = require('request')
const { expect } = require('chai')
const { server: config } = require('../server/config')
const testSchema = require('./fixtures/schema')
const testDocument = require('./fixtures/documents')

const baseUrl = `http://localhost:${config.port}/api/v1`

describe.only('content documents', () => {
  const createTestSchema = done => () => {
    request.post({ url: `${baseUrl}/schema`, body: testSchema.validSchema, json: true }, (err, res, body) => {
      if (err) throw (err)
      expect(res.statusCode).equal(201)
      done()
    })
  }

  const createTestDocument = done => () => {
    request.post({ url: `${baseUrl}/content/${testSchema.validSchema._id}`, body: testDocument.validDocument, json: true }, (err, res, body) => {
      if (err) throw (err)
      expect(res.statusCode).equal(201)
      done()
    })
  }

  it('should error when attempting to create a document that is not valid against the schema')

  it('Get a document item by slug', done => {
    createTestSchema(createTestDocument(
      () => {
        request.get({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(res.statusCode).to.equal(200)
          expect(body.data.slug).to.equal(testDocument.validDocument.slug)
          expect(body.data.content).to.eql(testDocument.validDocument.content)
          done()
        })
      }
    ))()
  })

  it('Should return a 404 when getting a document that does not exist', done => {
    // GET /documents/:documentId
    createTestSchema(
      () => {
        request.get(`${baseUrl}/content/${testSchema.validSchema._id}/nonexistent`, (err, res, body) => {
          if (err) throw (err)
          expect(res.statusCode).to.equal(404)
          done()
        })
      }
    )()
  })

  it('delete a document', done => {
    // DELETE /documents/:documentId
    const delDocument = () => {
      request.del({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(200)
        expect(body.value.content).eql(testDocument.validDocument.content)
        done()
      })
    }
    createTestSchema(createTestDocument(delDocument))()
  })

  it('Should return a 404 when deleting a document that does not exist', done => {
    // DELETE /documents/:documentId
    const delDocument = () => {
      request.del({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}-nope`, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(404)
        done()
      })
    }
    createTestSchema(createTestDocument(delDocument))()
  })

  it('update (replace) an existing document', done => {
    // PUT /documents/:documentId
    createTestSchema(createTestDocument(() => {
      request.put({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, body: testDocument.validUpdatedDocument, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(201)
        request.get({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(res.statusCode).to.equal(200)
          expect(body.data.content).to.eql(testDocument.validUpdatedDocument.content)
          done()
        })
      })
    }))()
  })

  it('update (partial) an existing document', done => {
    // PATCH /documents/:documentId
    createTestSchema(createTestDocument(() => {
      request.patch({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, body: testDocument.validPatchDocument, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.get({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}`, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(res.statusCode).to.equal(200)
          expect(body.data.content.title).to.eql(testDocument.validPatchDocument.content.title)
          expect(body.data.content.body).to.eql(testDocument.validDocument.content.body)
          done()
        })
      })
    }))()
  })

  it('should not update a non-existent document', done => {
    // PUT /documents/:documentId
    createTestSchema(createTestDocument(() => {
      request.put({ url: `${baseUrl}/content/${testSchema.validSchema._id}/${testDocument.validDocument.slug}-not-there`, body: testDocument.validUpdatedDocument, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(404)
        done()
      })
    }))()
  })

  it('should not create a new document for an non-existent schema', done => {
    createTestSchema(() => {
      request.post({ url: `${baseUrl}/content/${testSchema.validSchema._id}-noschema`, body: testDocument.validDocument, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(400)
        done()
      })
    })()
  })

  it('batch create documents from valid JSON', done => {
    createTestSchema(() => {
      request.post({ url: `${baseUrl}/content/${testSchema.validSchema._id}/batch`, body: testDocument.validBatchDocuments, json: true }, (err, res, body) => {
        if (err) throw (err)
        expect(res.statusCode).equal(201)
        done()
      })
    })()
  })

  it('import documents as csv')

  // , done => {
  //   // POST /import/csv
  // })

  it('Get a list of all documents of a particular schema', done => {
    // GET /documents/:schema
    createTestSchema(() => {
      request.post({ url: `${baseUrl}/content/${testSchema.validSchema._id}/batch`, body: testDocument.validBatchDocuments, json: true }, (err, res, body) => {
        if (err) throw (err)
        request.get({ url: `${baseUrl}/content/${testSchema.validSchema._id}`, json: true }, (err, res, body) => {
          if (err) throw (err)
          expect(body.data.length).equal(testDocument.validBatchDocuments.length)
          done()
        })
      })
    })()
  })

  it('Get a list of all documents regardless of schema')

  // , done => {
  //   // GET /documents
  // })

  it('can filter by relationship e.g. `?topics=1`')

  // , done => {
  //   // GET /documents?topics=1
  // })

  it('Get a minimal list of document ids and indications of related items')

  // , done => {
  //   // GET /documents_relationships
  // })

  it('Get a minimal list of document stubs')

  // , done => {
  //   // GET /documents_stubs
  // })

  it('Get a minimal list of document stubs by schema')

  // , done => {
  //   // GET /documents_stubs/:schema
  // })

  it('Get a minimal list of document ids and indications of related item')

  // , done => {
  //   // GET /documents_filters
  // })

  it('Get a minimal list of document ids and indications of related items')

  // , done => {
  //   // GET /documents_structure
  // })

  it('get an arbitrary collection of documents by id')

  // , done => {
  //   // GET /documents_items
  // })

  it('remove relationships for a document')

  // , done => {
  //   // DELETE /relationships/:documentId
  // })
})
