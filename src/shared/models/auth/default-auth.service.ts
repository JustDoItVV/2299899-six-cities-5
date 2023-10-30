import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';
import * as crypto from 'node:crypto';

import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Service } from '../../types/index.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { AuthService } from './auth-service.interface.js';
import {
  JWT_ALGORITHM, JWT_EXPIRED, TokenPayload, UserNotFoundException, UserPasswordIncorrectException
} from './index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.UserService) private readonly userService: UserService,
    @inject(Service.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findOne({email: dto.email});
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }
    return user;
  }
}
