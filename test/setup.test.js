const server = require('../server')
const mongodb = require('mongodb').MongoClient
const config = require('../server/config')

before(async function () {
  console.log('test suite started...')
  server.init()
  server.start()
})

after(function () {
  console.log('...test suite ended')
  server.close()
})

beforeEach(function () {
  mongodb.connect(config.db.connect, async (err, client) => {
    if (err) throw (err)
    const db = client.db(config.db.dbName)
    await db.collection(config.db.collections.documents).remove({})
    await db.collection(config.db.collections.schema).remove({})
    client.close()
  })

})
