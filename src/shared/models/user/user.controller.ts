import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Service } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './types/create-user-request.type.js';
import { Response } from 'express';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Service.Logger) protected readonly logger: Logger,
    @inject(Service.UserService) private readonly userService: UserService,
    @inject(Service.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController...');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);
    if (existedUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email '${body.email}' already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response
  ): Promise<void> {
    const existedUser = await this.userService.findByEmail(body.email);
    if (!existedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email '${body.email} not found.'`,
        'UserControlle'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented.',
      'UserController'
    );
  }
}
