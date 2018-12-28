/**
 * Schema are the shape of the different types of content and are defined as JSONSchema
 *
 * For 'development' of content - I have this idea that these can be stored in a collection in the mongodb -
 * and for optimised delivery of content, to make use of Fastify's optimisation, the JSON schema
 * will to be preloaded at app start and included in the routes definition
 *
 * TODO: add a UI property for the integration of ReactJSON Schema form UI
 *
 */

module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async function (req, reply) {
      const { db } = fastify.mongo
      try {
        const collection = await db.collection('schema')
        const docs = await collection.find().toArray()
        return reply.send(docs)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/:schema',
    handler: async function (req, reply) {
      const { db } = fastify.mongo
      try {
        const collection = await db.collection('schema')
        const doc = await collection.find({ _id: req.params.schema }).toArray()
        reply.send(doc)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          schema: {
            type: 'object'
          }
        },
        required: ['_id', 'schema']
      }
    },
    handler: async function (req, reply) {
      const { db } = fastify.mongo
      try {
        const collection = await db.collection('schema')
        const response = await collection.insertOne(req.body)
        return reply.code(201).send(response)
      } catch (error) {
        reply.send(error)
      }
    }
  })

  fastify.route({
    method: 'PUT',
    url: '/:schema',
    schema: {
      body: {
        type: 'object',
        properties: {
          schema: {
            type: 'object'
          }
        },
        required: ['schema']
      }
    },
    handler: async function (req, reply) {
      const { db } = fastify.mongo
      try {
        const collection = await db.collection('schema')
        const response = await collection.findAndModify(
          { _id: req.params.schema },
          [],
          req.body,
          { new: true })
        return reply.send(response)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/:schema',
    handler: async function (req, reply) {
      const { db } = fastify.mongo
      try {
        const collection = await db.collection('schema')
        const response = await collection.findOneAndDelete({
          _id: req.params.schema
        })
        return reply.send(response)
      } catch (error) {
        return reply.send(error)
      }
    }
  })
  next()
}
