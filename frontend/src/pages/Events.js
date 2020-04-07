import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import LoginContext from "../context/login";
import EventList from "../components/Events/EventList/EventList";
import "./css/events.css";

class Events extends Component {
  state = {
    creating: false,
    events: [],
  };

  static contextType = LoginContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    this.sendEvents(event);
  };

  sendEvents = async ({ title, price, date, description }) => {
    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
    };
    try {
      const token = this.context.token;
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      let responsed = await response.json();
      this.setState((prevState) => {
        const updateEvents = [...prevState.events];
        updateEvents.push({
          _id: responsed.data.createEvent._id,
          title: responsed.data.createEvent.title,
          description: responsed.data.createEvent.description,
          date: responsed.data.createEvent.date,
          price: responsed.data.createEvent.price,
          creator: {
            _id: this.context.userId,
          },
        });
        this.setState({ events: updateEvents });
      });
    } catch (error) {
      throw error;
    }
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents = async () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const responseData = await response.json();
      const events = responseData.data.events;
      this.setState({ events });
    } catch (error) {
      throw error;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <EventList
          events={this.state.events}
          authUserId={this.context.userId}
        />
      </React.Fragment>
    );
  }
}

export default Events;
