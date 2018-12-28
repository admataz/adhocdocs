const server = require('../server')
const { db } = require('../server/config')

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

})

afterEach(function () {

})
