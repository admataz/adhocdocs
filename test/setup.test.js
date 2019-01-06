const server = require('../server')
const mongodb = require('mongodb').MongoClient
const config = require('../server/config')

before(done => {
  console.log('test suite started...')
  server.init()
  server.start(done)
  // done()
})

after(done => {
  console.log('...test suite ended')
  server.close()
  done()
})

beforeEach(done => {
  mongodb.connect(config.db.connect, { useNewUrlParser: true }, async (err, client) => {
    if (err) throw (err)
    const db = client.db(config.db.dbName)
    await db.collection(config.db.collections.documents).deleteMany({})
    await db.collection(config.db.collections.schema).deleteMany({})
    client.close()
    done()
  })
})
