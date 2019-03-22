const Mutation = {
  createDog(parent, args, ctx, info) {
    // Soon, we will save to a database using Prisma
    // GraphQL Yoga is a server, and doesn't have a database on its own
    // But let's use in-memory global as our database for now,
    // just to show how it works
    global.dogs = global.dogs || [];
    const newDog = { name: args.name };
    global.dogs.push(newDog);
    return newDog;
  },
};

module.exports = Mutation;
