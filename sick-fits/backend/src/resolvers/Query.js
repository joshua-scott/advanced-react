const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  // This is the 'standard' way of making a query to our Prisma db:
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // },

  // ...but in a common case where the query is exactly the same as we have in Prisma,
  // and we don't need anything else to happen such as authentication etc,
  // we can simply forward the query directly to our Prisma db, like this:
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    // Check if there is a current user id
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    // 2. Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. If they do, query all the users
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
