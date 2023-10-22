import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import * as CONSTS from '../comment.const.js';

export class CreateCommentDto {
  @IsString({ message: 'Text is required' })
  @Length(CONSTS.TextLength.MIN, CONSTS.TextLength.MAX, { message: `Min length is ${CONSTS.TextLength.MIN}, max is ${CONSTS.TextLength.MAX}` })
  public text: string;

  @IsInt({ message: 'Rating is required and must be integer' })
  @Min(CONSTS.Rating.MIN, { message: `Min rating is ${CONSTS.Rating.MIN}` })
  @Max(CONSTS.Rating.MAX, { message: `Max rating is ${CONSTS.Rating.MAX}` })
  public rating: number;

  @IsMongoId({ message: 'AuthorId field is required and must be a valid Mongo id' })
  public authorId: string;

  @IsMongoId({ message: 'OfferId field is required and must be a valid Mongo id' })
  public offerId: string;
}
