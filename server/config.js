require('dotenv').config()

const conf = {
  db: {
    connect: process.env.DB_CONNECT || 'mongodb://localhost/',
    dbName: process.env.DB_NAME || 'adhocdocs',
    collections: {
      schema: process.env.DB_COLLECTION_NAME_SCHEMA || 'schema',
      documents: process.env.DB_COLLECTION_NAME_DOCUMENTS || 'documents'
    }
  },
  server: {
    logging: process.env.LOG_LEVEL ? { level: process.env.LOG_LEVEL } : false,
    port: process.env.PORT || '3001'
  }
}

module.exports = conf
