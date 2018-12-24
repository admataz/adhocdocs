const fastify = require('./server').fastify

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

  console.log(res)
})

console.log(fastify.mongo)
// fastify.mongo.close()

// server.close()
