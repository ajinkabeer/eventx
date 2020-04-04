const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models//user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (error) {
    throw error;
  }
};

const events = async eventId => {
  try {
    const event = await Event.find({ _id: { $in: eventId } });
    event.map(event => {
      return {
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator)
      };
    });
    return event;
  } catch (error) {
    throw error;
  }
};

{
  module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
          };
        });
      } catch (error) {
        throw error;
      }
    },

    createEvent: async args => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5e8834e355e060394898d741"
      });
      try {
        let createdEvent;
        const saveEventResponse = await event.save();
        createdEvent = {
          ...saveEventResponse._doc,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, saveEventResponse.creator)
        };
        const findUser = await User.findById("5e8834e355e060394898d741");
        if (!findUser) {
          throw new Error("User not found");
        } else {
          findUser.createdEvents.push(event);
          await findUser.save();
          return createdEvent;
        }
      } catch (error) {
        throw error;
      }
    },

    createUser: async args => {
      try {
        const user = await User.findOne({ email: args.userInput.email });
        if (user) {
          throw new Error("User exists already");
        } else {
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
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
    }
  };
}
