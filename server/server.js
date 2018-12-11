
module.exports = function (fastify, opts, next) {
  fastify.get('/', (req, reply) => {
    reply.send({ hello: 'world' })
  })

  // register routes
  fastify.register(require('./api'), { prefix: '/api/v1' })
  next()
}
