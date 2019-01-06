const config = require('./config')

const fastify = require('fastify')({
  logger: config.server.logging
})

const fastifyMongoDb = require('fastify-mongodb')
const server = require('./server')

function init () {
  fastify.register(fastifyMongoDb, {
    url: `${config.db.connect}/${config.db.dbName}`,
    useNewUrlParser: true
  })

  fastify.register(server, err => {
    if (err) throw err
  })
}

function start (cb) {
  return fastify.listen(config.server.port || 3001, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
    if (typeof cb === 'function') {
      cb()
    }
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
