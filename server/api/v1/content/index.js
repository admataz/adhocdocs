/**
 * provide the CRUD pattern for definition of basic  RESTful endpoints and interaction with the MongoDB
 *
 * @exports <Function>
 */

const httpErrors = require('http-errors')
const slugify = require('@sindresorhus/slugify')
const papaparse = require('papaparse')
const fileUpload = require('fastify-file-upload')

const { db: { collections: { documents: DOCUMENTS_COLLECTION_NAME, schema: SCHEMA_COLLECTION_NAME } } } = require('../../../config')
const dbConnector = require('./queries')

const docSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        }
      },
      required: ['title']
    },
    related: {
      type: 'array'
    },
    slug: {
      type: 'string'
    }
  },
  required: ['content']
}

module.exports = (fastify, options, next) => {
  const { db, ObjectId } = fastify.mongo
  fastify.decorate('docsDb', dbConnector(db, DOCUMENTS_COLLECTION_NAME, SCHEMA_COLLECTION_NAME))
  fastify.register(fileUpload)
  try {
    fastify.docsDb.initDocumentsCollection()
  } catch (error) {
    throw (error)
  }

  // abstract the mongo-ness away a little
  fastify.decorate('dbUtils', {
    dbid: i => ObjectId(i)
  })

  /*
  TODO:
  - make documents collection name configurable
  - make schema available through db
  - memoize the schema
  - validate the params
  - validate the input according to the schema
  - validate the output according  to the schema
  - move the configurations to plugins/
  */

  /**
   * GET a list of all items
   *
   * TODO: add search/filter parameters
   * TODO: add summaryOnly parameter
   */
  fastify.route({
    method: 'GET',
    url: '/',
    handler: async function (req, reply) {
      try {
      // const fields = req.query.fields ? req.query.fields.split(',') : []
      // const searchfields = req.query.search ? req.query.search.split(',') : fields
      // const q = req.query.q ? searchfields.map(f => ( { f : {$regex:req.query.q} })) : [{}]
      // const q = [{}]
        const docs = await fastify.docsDb.getDocumentList({})
        return reply.send(docs)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * GET a list of all items for the current schema
   *
   * TODO: add search/filter parameters
   * TODO: add summaryOnly parameter
   */
  fastify.route({
    method: 'GET',
    url: '/:schemaName',
    handler: async function (req, reply) {
      try {
      // const fields = req.query.fields ? req.query.fields.split(',') : []
      // const searchfields = req.query.search ? req.query.search.split(',') : fields
      // const q = req.query.q ? searchfields.map(f => ( { f : {$regex:req.query.q} })) : [{}]
      // const q = [{}]
        const docs = await fastify.docsDb.getDocumentList({ schema: req.params.schemaName })
        return reply.send({ data: docs })
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * GET a single item by the slug id
   */
  fastify.route({
    method: 'GET',
    url: '/:schemaName/:slug',
    handler: async function (req, reply) {
      try {
        const doc = await fastify.docsDb.getDocument({ slug: req.params.slug, schema: req.params.schemaName })
        if (!doc) {
          return reply.send(httpErrors.NotFound())
        }
        return reply.send({ data: doc })
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * GET a one or more items by the database ids
   */
  fastify.route({
    method: 'GET',
    url: '/collection/:ids',
    handler: async function (req, reply) {
      try {
        const ids = req.params.ids.split(',').map(id => fastify.dbUtils.dbid(id))
        const doc = await fastify.docsDb.getDocumentList({ _id: { $in: ids } })
        if (!doc) {
          return reply.send(httpErrors.NotFound())
        }
        return reply.send({ data: doc })
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * DELETE an item
   */
  fastify.route({
    method: 'DELETE',
    url: '/:schemaName/:slug',
    handler: async function (req, reply) {
      try {
        const doc = await fastify.docsDb.deleteDocument({ slug: req.params.slug, schema: req.params.schemaName })
        return reply.send(doc)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * POST and create a new item
   */
  fastify.route({
    method: 'POST',
    url: '/:schemaName',
    schema: { body: docSchema },
    handler: async function (req, reply) {
      try {
        const doc = {
          content: req.body.content,
          related: req.body.related || [],
          schema: req.params.schemaName,
          slug: slugify(req.body.slug || req.body.content.title)
        }
        const dbresult = await fastify.docsDb.insertDocument(doc, req.params.schemaName)
        return reply.code(201).send(dbresult)
      } catch (error) {
        if (error.message === 'SCHEMA_NOT_FOUND') {
          return reply.send(httpErrors.BadRequest())
        }
        return reply.send(error)
      }
    }
  })

  /**
   * POST and create a batch of new items
   */
  fastify.route({
    method: 'POST',
    url: '/:schemaName/batch',
    schema: { body: {
      type: 'array',
      items: docSchema
    } },
    handler: async function (req, reply) {
      try {
        const results = await Promise.all(req.body.map(async (payload) => {
          const doc = {
            content: payload.content,
            related: payload.related || [],
            schema: req.params.schemaName,
            slug: slugify(payload.slug || payload.content.title)
          }
          const dbresult = await fastify.docsDb.insertDocument(doc, req.params.schemaName)
          return dbresult
        }))

        return reply.code(201).send({ data: results })
      } catch (error) {
        if (error.message === 'SCHEMA_NOT_FOUND') {
          return reply.send(httpErrors.BadRequest())
        }
        return reply.send(error)
      }
    }
  })

  /**
   * PUT and replace a new item
   */
  fastify.route({
    method: 'PUT',
    url: '/:schemaName/:slug',
    schema: {
      body: {
        type: 'object',
        properties: {
          content: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              }
            },
            required: ['title']
          },
          related: {
            type: 'array'
          },
          slug: {
            type: 'string'
          }
        }
      }
    },
    handler: async function (req, reply) {
      try {
        const doc = {
          content: req.body.content,
          related: req.body.related || [],
          schema: req.params.schemaName,
          slug: slugify(req.body.slug || req.params.slug)
        }

        const dbresult = await fastify.docsDb.updateDocument({ slug: req.params.slug, schema: req.params.schemaName }, doc)
        return reply.code(201).send(dbresult)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  /**
   * PUT  update an existing item
   */
  fastify.route({
    method: 'PATCH',
    url: '/:schemaName/:slug',
    schema: {
      body: {
        type: 'object',
        properties: {
          content: {
            type: 'object',
            properties: {
              title: {
                type: 'string'
              }
            }
          },
          related: {
            type: 'array'
          },
          slug: {
            type: 'string'
          }
        },
        required: ['content']
      }
    },
    handler: async function (req, reply) {
      try {
        const updateObj = Object.assign(req.body, { slug: slugify(req.body.slug || req.params.slug) })
        const result = await fastify.docsDb.patchDocument({ slug: req.params.slug, schema: req.params.schemaName }, updateObj)
        return reply.send(result)
      } catch (error) {
        return reply.send(error)
      }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/:schemaName/upload',
    handler: async function (req, reply) {
      const files = req.raw.files
      if (!files.test) {
        return reply.send(httpErrors.BadRequest('missing file upload'))
      }

      reply.send(papaparse.parse(files.test.data.toString('utf8')))

      // let fileArr = []
      // papaparse.parse(files.test, {
      //   step: r => console.log(r),
      //   complete: r => reply.send(r)
      // })

      // for (let key in files) {
      //   fileArr.push({
      //     name: files[key].name,
      //     mimetype: files[key].mimetype
      //   })
      // }
      // reply.send(fileArr)
    }
  })

  next()
}
