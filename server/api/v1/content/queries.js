const httpErrors = require('http-errors')

module.exports = (db, DOCUMENTS_COLLECTION_NAME, SCHEMA_COLLECTION_NAME) => ({

  async initDocumentsCollection () {
    const collection = await db.createCollection(DOCUMENTS_COLLECTION_NAME)
    collection.createIndex({
      slug: 1,
      schema: 1
    },
    {
      unique: true
    })
  },

  async getDocumentList (query) {
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.find(query).toArray()
    return result
  },
  async getDocument (query) {
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.findOne(query)
    return result
  },
  async insertDocument (document, schema) {
    const schemaCollection = await db.collection(SCHEMA_COLLECTION_NAME)
    const validSchemaIds = await schemaCollection.find({}).toArray()

    if (!validSchemaIds.map(s => s._id).includes(schema)) {
      throw httpErrors.BadRequest('SCHEMA_NOT_FOUND')
    }
    const d = new Date().getTime()
    const saveObj = { ...document, created: d, lastModified: d }
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.insertOne(saveObj)
    return result.ops[0]
  },
  async deleteDocument (query) {
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.findOneAndDelete(query)
    if (!result.value) {
      throw httpErrors.NotFound()
    }
    return result
  },
  async updateDocument (query, document) {
    const d = new Date().getTime()
    const saveObj = { ...document, lastModified: d }
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.findOneAndUpdate(
      query,
      { $set: saveObj },
      { returnOriginal: false }
    )
    if (!result.value) {
      throw httpErrors.NotFound()
    }
    return result
  },
  async patchDocument (query, updateObj) {
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const d = new Date().getTime()
    const saveObj = {}
    saveObj.lastModified = d

    Object.keys(updateObj.content).forEach(k => {
      saveObj[`content.${k}`] = updateObj.content[k]
    })
    if (updateObj.slug) {
      saveObj['slug'] = updateObj.slug
    }
    if (updateObj.related) {
      saveObj['related'] = updateObj.related
    }

    const result = await collection.findOneAndUpdate(query, { $set: saveObj })
    return result
  }
})
