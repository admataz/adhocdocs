const testSchema1 = {
  '_id': 'testSchema1',
  'schema': {
    'type': 'object',
    'title': 'SimpleItem2',
    'properties': {
      'name': {
        'type': 'string',
        'title': 'Name'
      },
      'description': {
        'type': 'string',
        'title': 'Descripiton',
        'default': ''
      }
    },
    'required': [
      'name'
    ]
  }
}

module.exports = testSchema1
