
module.exports = function (fastify, opts, next) {
  fastify.get('/', (req, reply) => {
    reply.send({ hello: 'world' })
  })

  fastify.get('/health', (req, reply) => {
    reply.send('ok')
  })

  fastify.register(require('./v1'), { prefix: '/v1' })
  next()
}
