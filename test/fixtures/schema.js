const validSchema = {
  '_id': 'testSchema1',
  'schema': {
    'type': 'object',
    'title': 'SimpleItem',
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

const missingId = {
  'schema': {
    'type': 'object',
    'title': 'SimpleItem',
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

const missingName = {
  '_id': 'testSchema1',
  'schema': {
    'type': 'object',
    'title': 'SimpleItem',
    'properties': {
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

const invalidSchema = {
  'schema': {
    'title': 'SimpleItem',

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

const updateSchemaBody = {
  'type': 'object',
  'title': 'SimpleItem updated',
  'properties': {
    'name': {
      'type': 'string',
      'title': 'Name'
    },
    'description': {
      'type': 'string',
      'title': 'Descripiton',
      'default': ''
    },
    'newProperty': {
      'type': 'string',
      'title': 'New Property'
    }
  },
  'required': [
    'name'
  ]
}

module.exports = {
  validSchema,
  missingId,
  missingName,
  invalidSchema,
  updateSchemaBody
}
