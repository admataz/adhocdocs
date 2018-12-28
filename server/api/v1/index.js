/**
 * The root API
 */
module.exports = async function (fastify, options, next) {
  fastify.get('/', function (req, reply) {
    reply.send({ version: '1.0.0' })
  })

  fastify.register(require('./content'), { prefix: '/content' })
  fastify.register(require('./schema'), { prefix: '/schema' })

  next()
}
