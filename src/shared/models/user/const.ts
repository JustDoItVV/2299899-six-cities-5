export enum NameLength {
  MIN = 1,
  MAX = 15,
}

export const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const AVATAR_PATTERN = /([^/('"\\]+)\.(jpg|png)/;

export enum PasswordLength {
  MIN = 6,
  MAX = 12,
}
