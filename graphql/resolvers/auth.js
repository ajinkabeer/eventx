const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models//user");

{
  module.exports = {
    createUser: async (args) => {
      try {
        const user = await User.findOne({ email: args.userInput.email });
        if (user) {
          throw new Error("User exists already");
        } else {
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          try {
            const response = await user.save();
            return { ...response._doc, password: null };
          } catch (error) {
            throw error;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    login: async ({ email, password }) => {
      const user = User.findOne({ email });
      if (!user) {
        throw new Error("User does not exist!");
      }
      const isPasswordEqual = await bcrypt.compare(password, user.password);
      if (!isPasswordEqual) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "somesupersecretkey",
        { expiresIn: "1h" }
      );
      return { userId: user.id, token, tokenExpiration: 1 };
    },
  };
}
