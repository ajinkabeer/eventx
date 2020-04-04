const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models//user");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
          _id:ID!
          email:String!
          password:String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
          email:String!
          password:String!
        }

        type RootQuery {
            events:  [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput:UserInput):User
        }

        schema {
            query: RootQuery
            mutation:RootMutation
        }

    `),
    rootValue: {
      events: async () => {
        try {
          let events = await Event.find();
          return events.map(event => {
            return { ...event._doc };
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
          let saveEventResponse = await event.save();
          createdEvent = { ...saveEventResponse._doc };
          const findUser = await User.findById("5e8834e355e060394898d741");
          if (findUser === null) {
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
            let hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword
            });
            try {
              let response = await user.save();
              return { ...response._doc, password: null };
            } catch (error) {
              throw error;
            }
          }
        } catch (error) {
          throw error;
        }
      }
    },
    graphiql: true
  })
);

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-tjanz.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
    );
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
};

startServer();
