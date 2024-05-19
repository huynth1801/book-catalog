const BookSchema = {
    name: {
      type: 'string',
      required: true,
      maxLength: 100
    },
    authors: {
      type: 'array',
      required: true,
      minLength: 1
    },
    publicationYear: {
      type: 'number',
      required: false,
      min: 1801
    },
    rating: {
      type: 'number',
      required: false,
      min: 0,
      max: 10,
      default: 0
    },
    isbn: {
      type: 'string',
      required: false
    }
};

export default BookSchema;