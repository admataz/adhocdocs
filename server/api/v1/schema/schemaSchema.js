module.exports = {
  type: 'object',
  properties: {
    _id: {
      type: 'string'
    },
    schema: {
      type: 'object',
      required: ['required', 'properties'],
      properties: {
        required: {
          type: 'array',
          items: { type: 'string' },
          uniqueItem: true,
          default: ['name']
        },
        properties: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'object',
              required: ['type', 'title'],
              properties: {
                type: {
                  type: 'string',
                  enum: ['string']
                },
                title: {
                  type: 'string'
                },
                default: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  required: ['_id', 'schema']
}
