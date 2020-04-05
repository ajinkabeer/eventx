const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { tarnsformBooking, transformEvent } = require("./merge");

{
  module.exports = {
    booking: async (args, req) => {
      if (!req.isAuth) {
        throw new Error("You are not authorized");
      }
      try {
        const bookings = await Booking.find();
        return bookings.map((booking) => {
          return tarnsformBooking(booking);
        });
      } catch (error) {
        throw error;
      }
    },
    bookEvent: async (args, req) => {
      if (!req.isAuth) {
        throw new Error("You are not authorized");
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const result = await booking.save();
      return tarnsformBooking(result);
    },
    cancelBooking: async (args, req) => {
      if (!req.isAuth) {
        throw new Error("You are not authorized");
      }
      try {
        const booking = await Booking.findById(args.bookingId).populate(
          "event"
        );
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    },
  };
}
