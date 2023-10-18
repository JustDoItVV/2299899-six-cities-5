export const Service = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  OfferService: Symbol.for('OfferService'),
  OfferModel: Symbol.for('OfferModel'),
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  OfferController: Symbol.for('OfferController'),
  UserController: Symbol.for('UserController'),
  CommentController: Symbol.for('CommentController'),
} as const;
