const config = require('./config')

const fastify = require('fastify')({
  logger: config.server.logging
})

const fastifyMongoDb = require('fastify-mongodb')
const server = require('./server')

function init () {
  fastify.register(fastifyMongoDb, {
    url: config.db.connect,
    useNewUrlParser: true
  })

  fastify.register(server, err => {
    if (err) throw err
  })
}

function start () {
  fastify.listen(config.server.PORT || 3001, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
  })
}

function close () {
  fastify.close(err => {
    if (err) throw err
    console.log(`server stopped listening listening on ${fastify.server.address().port}`)
  })
}

module.exports = {
  fastify,
  init,
  start,
  close
}
