module.exports = (db, DOCUMENTS_COLLECTION_NAME) => ({

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
  async insertDocument (document) {
    const d = new Date().getTime()
    const saveObj = { ...document, created: d, lastModified: d }
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.insertOne(saveObj)
    return result
  },
  async deleteDocument (query) {
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.findOneAndDelete(query)
    return result
  },
  async updateDocument (query, document) {
    const d = new Date().getTime()
    const saveObj = { ...document, lastModified: d }
    const collection = await db.collection(DOCUMENTS_COLLECTION_NAME)
    const result = await collection.findOneAndUpdate(query, { $set: saveObj })
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
