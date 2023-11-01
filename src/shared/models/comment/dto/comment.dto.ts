import UserDto from '../../user/dto/user.dto.js';

export default class CommentDto {
  public id!: string;

  public text!: string;

  public date!: string;

  public user!: UserDto;
}
