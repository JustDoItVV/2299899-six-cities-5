import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import * as CONSTS from '../comment.const.js';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.text.invalidFormat })
  @Length(CONSTS.TextLength.MIN, CONSTS.TextLength.MAX, { message: CreateCommentMessages.text.lengthField })
  public text: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(CONSTS.Rating.MIN, { message: CreateCommentMessages.rating.range })
  @Max(CONSTS.Rating.MAX, { message: CreateCommentMessages.rating.range })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.authorId.invalidFormat })
  public authorId: string;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId: string;
}
