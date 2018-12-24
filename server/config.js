require('dotenv').config()

const conf = {
  db: {
    connect: process.env.DB_CONNECT || 'mongodb://localhost/adhocdocs'
  },
  server: {
    logging: process.env.LOG_LEVEL ? { level: process.env.LOG_LEVEL } : false,
    port: process.env.PORT || '3001'
  }
}

module.exports = conf
