import * as CONSTS from '../comment.const.js';

export const CreateCommentMessages = {
  text: {
    invalidFormat: 'Text is required',
    lengthField: `Min length is ${CONSTS.TextLength.MIN}, max is ${CONSTS.TextLength.MAX}`
  },
  rating: {
    invalidFormat: 'Rating is required and must be integer',
    range: `Min is ${CONSTS.Rating.MIN}, max is ${CONSTS.Rating.MAX}`,
  },
  authorId: {
    invalidFormat: 'AuthorId field is required and must be a valid Mongo id',
  },
  offerId: {
    invalidFormat: 'OfferId field is required and must be a valid Mongo id',
  },
} as const;
