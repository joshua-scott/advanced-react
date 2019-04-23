const { forwardTo } = require('prisma-binding');

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
};

module.exports = Query;
