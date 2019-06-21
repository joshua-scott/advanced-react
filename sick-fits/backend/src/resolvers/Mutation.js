const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');

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

  updateItem(parent, args, ctx, info) {
    // First take a copy of the updates
    const updates = { ...args };
    // Remove the ID from the updates
    delete updates.id;
    // Run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // 2. Check if they own that item, or have the permissions
    // todo

    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // 1. Lowercase email
    args.email = args.email.toLowerCase();
    // 2. Hash password
    const password = await bcrypt.hash(args.password, 10);
    // 3. Create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // Create the JWT for the user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // Finally, return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. Check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      // ! Note: this isn't really best practise in terms of security; better to give a generic error message instead of telling them whether the email or password was wrong.
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid password!`);
    }
    // 3. Generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // 5. Return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  async requestReset(parent, args, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      // ! Note: another security risk as it can reveal who has an account
      throw new Error(`No such user found for email ${args.email}`);
    }

    // 2. Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });

    // 3. Email them the reset token
    const mailRes = await transport.sendMail({
      from: 'scotty313@gmail.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(
        `<p>Your password reset token is here!</p>
          <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
            Click here to reset your password.
          </a>`
      ),
    });

    // 4. Return the message
    return { message: 'Password reset requested!' };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. Check the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error(`Your passwords don't match!`);
    }
    // 2. Check it's a legit reset token that hasn't expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });

    if (!user) {
      throw new Error(
        `This token is either invalid or expired - try requesting another password reset.`
      );
    }

    // 3. Hash their new password
    const password = await bcrypt.hash(args.password, 10);

    // 4. Save the new password to the user and remove old password reset fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // 5. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // 6. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    // 7. Return the new user
    return updatedUser;
  },
};

module.exports = Mutation;
