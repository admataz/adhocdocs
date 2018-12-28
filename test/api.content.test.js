const { fastify, init } = require('../server')
const { expect } = require('chai')

describe('create new content', () => {
  it('should create a new content item', () => {
    const sampleContent = {
      'schema_name': 'testSchema',
      'content': {
        'title': 'a test title',
        'body': 'test body'
      }
    }
    init()

    fastify.inject({
      url: '/api/v1/content/testSchema',
      method: 'POST',
      payload: sampleContent
    }, (err, res) => {
      if (err) {
        console.log(err.message)
      }
      expect(res.statusCode).equal(200)
      // console.log(res)
    })
  })
})
