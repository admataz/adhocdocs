const chance = require('chance').Chance()

function makeValidDocument (slug = false, schemaName = 'testSchema1') {
  const doc = {
    'schema_name': schemaName,
    'content': {
      'title': chance.sentence({ words: 5 }),
      'body': chance.paragraph({ sentences: 3 })
    }
  }
  if (slug) {
    doc.slug = slug
  }
  return doc
}

function makeValidDocumentUpdate (schemaName = 'testSchema1') {
  return {
    'content': {
      'title': chance.sentence({ words: 5 }),
      'body': chance.paragraph({ sentences: 3 })
    }
  }
}

function makeValidDocumentPatch () {
  return {
    'content': {
      'title': chance.sentence({ words: 5 })
    }
  }
}

function makeValidBatchDocuments (num = 100) {
  const docs = []
  for (let i = 0; i <= num; i++) {
    docs.push(makeValidDocument())
  }
  return docs
}

module.exports = {
  validDocument: makeValidDocument('test-doc'),
  validUpdatedDocument: makeValidDocumentUpdate(),
  validPatchDocument: makeValidDocumentPatch(),
  validBatchDocuments: makeValidBatchDocuments()
}
