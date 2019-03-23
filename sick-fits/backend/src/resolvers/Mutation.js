const Mutation = {
  async createItem(parent, args, ctx, info) {
    // todo: check they're logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args },
      },
      info
    );

    return item;
  },
};

module.exports = Mutation;
