process.env.PORT = 3002
const server = require('./server')
server.start()

server.close()
