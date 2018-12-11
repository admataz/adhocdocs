/**
 * The root API
 */
module.exports = async function (fastify, options, next) {
  fastify.get('/', function (req, reply) {
    reply.send({ hello: 'world' })
  })

  fastify.register(require('./content'), { prefix: '/content' })
  fastify.register(require('./schema'), { prefix: '/schema' })

  next()
}
