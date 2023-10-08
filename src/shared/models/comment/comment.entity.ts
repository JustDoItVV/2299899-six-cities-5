import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Comment } from '../../types/index.js';
import * as CONST from './const.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps implements Comment {
  @prop({
    required: true,
    minlength: [CONST.TextLength.MIN, `Min length for text is ${CONST.TextLength.MIN}`],
    maxlength: [CONST.TextLength.MAX, `Max length for text is ${CONST.TextLength.MAX}`],
    default: '',
  })
  public text: string;

  @prop({
    required: true,
    default: Date.now(),
  })
  public date: Date;

  @prop({
    required: true,
    min: CONST.Rating.MIN,
    max: CONST.Rating.MAX,
    default: CONST.Rating.MAX,
  })
  public rating: number;

  @prop({
    required: true,
    default: '',
  })
  public author: string;

  constructor(commentData: Comment) {
    super();
    this.text = commentData.text;
    this.date = commentData.date;
    this.rating = commentData.rating;
    this.author = commentData.author;
  }

}

export const CommentModel = getModelForClass(CommentEntity);
