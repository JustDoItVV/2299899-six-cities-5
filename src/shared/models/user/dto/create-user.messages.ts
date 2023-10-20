import { UserType } from '../../../types/index.js';
import * as CONSTS from '../user.const.js';

export const CreateUserMessages = {
  name: {
    invalidFormat: 'Name is required',
    lengthField: `Min length for name is ${CONSTS.NameLength.MIN}, max is ${CONSTS.NameLength.MAX}`
  },
  email: {
    invalidFormat: 'Email is required',
  },
  avatar: {
    invalidFormat: 'Avatar is required',
  },
  type: {
    invalidFormat: `Type must be ${UserType}`,
  },
  password: {
    invalidFormat: 'Password is required',
    lengthField: `Min length for password is ${CONSTS.PasswordLength.MIN}, max is ${CONSTS.PasswordLength.MAX}`
  },
} as const;
