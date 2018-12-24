const fastify = require('../../server').fastify

describe('create new schema', () => {
  it('should create a new schema', () => {
    const sampleSchema = {
      'type': 'object',
      'title': 'SimpleItem',
      'properties': {
        'name': {
          'type': 'string',
          'title': 'Name'
        },
        'description': {
          'type': 'string',
          'title': 'Descripiton',
          'default': ''
        }
      },
      'required': ['name']
    }

    fastify.inject({
      url: '/api/v1/schema',
      method: 'POST',
      payload: {
        _id: 'SimpleSchema',
        schema: sampleSchema
      }
    }, (err, res) => {
      if (err) {
        console.log(err.message)
      }
      expect(res.statusCode).toEqual(200)
      // console.log(res)
    })
  })
})
