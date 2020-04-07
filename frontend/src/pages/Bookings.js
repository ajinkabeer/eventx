import React, { Component } from "react";
import LoginContext from "../context/login";
import Spinner from "../components/Spinner/Spinner";
import BookingList from "../components/Bookings/BookingsList/BookList";

class Bookings extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = LoginContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = async () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            booking {
              _id
             createdAt
             event {
               _id
               title
               date
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
          Authorization: "Bearer " + this.context.token,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const responseData = await response.json();
      const bookings = responseData.data.booking;
      this.setState({ bookings, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  };

  deleteBookingHandler = async (bookingId) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId:$id){
              _id
              title
            }
          }
        `,
      variables: {
        id: bookingId,
      },
    };
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.context.token,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      await response.json();
      this.setState((prevState) => {
        const updatedBookings = prevState.bookings.filter((booking) => {
          return booking._id !== bookingId;
        });
        return { bookings: updatedBookings, isLoading: false };
      });
    } catch (error) {
      this.setState({ isLoading: false });
      throw error;
    }
  };

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <BookingList
            bookings={this.state.bookings}
            onDelete={this.deleteBookingHandler}
          />
        )}
      </>
    );
  }
}

export default Bookings;
