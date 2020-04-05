const Event = require("../../models/event");
const { transformEvent } = require("./merge");

{
  module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map((event) => {
          return transformEvent(event);
        });
      } catch (error) {
        throw error;
      }
    },
    createEvent: async (args, req) => {
      if (!req.isAuth) {
        throw new Error("You are not authorized");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5e8834e355e060394898d741",
      });
      try {
        let createdEvent;
        const saveEventResponse = await event.save();
        createdEvent = transformEvent(saveEventResponse);
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
  };
}
