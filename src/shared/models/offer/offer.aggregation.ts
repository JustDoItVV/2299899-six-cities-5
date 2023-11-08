export const mainOffersPipeline = [
  {
    $addFields: {
      id: { $toString: '$_id' },
      commentsCount: { $size: '$comments' },
      rating: {
        $divide: [
          {
            $reduce: {
              input: '$comments',
              initialValue: 0,
              in: { $add: ['$$value', '$$this.rating'] },
            },
          },
          {
            $cond: [{ $ne: [{ $size: '$comments' }, 0] }, { $size: '$comments' }, 1],
          },
        ],
      },
      isFavorite: { $in: ['$_id', { $ifNull: ['$user.favorites', []] }] },
    },
  },
];

export const getUserPipeline = (userId: string) => [
  { $lookup: {
    from: 'users',
    let: { userId: { $toObjectId: userId } },
    pipeline: [
      { $match: { $expr: { $eq: ['$_id', '$$userId'] } } },
    ],
    as: 'users',
  } },
  { $addFields: { user: { $arrayElemAt: ['$users', 0] } } },
];

export const authorPipeline = [
  { $lookup: {
    from: 'users',
    localField: 'authorId',
    foreignField: '_id',
    as: 'authorId',
  } },
  { $addFields: { authorId: { $arrayElemAt: ['$authorId', 0] } } },
];

export const commentsPipeline = [
  { $lookup: {
    from: 'comments',
    localField: '_id',
    foreignField: 'offerId',
    as: 'comments',
  } },
];
