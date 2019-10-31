import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
export default class Profile extends React.Component {
  constructor() {
    super();
    this.printComments = this.printComments.bind(this);
  }
  componentDidMount() {
    fetch(this.props.serverPort + "/take", {
      method: "POST",
      body: JSON.stringify(this.props.data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        fetch(this.props.serverPort + "/userComments", {
          method: "POST",
          body: JSON.stringify(this.props.data),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(userComments => {
            console.log(userComments);
            this.setState({
              comments: userComments,
              userData: data
            });
          });
      });
  }

  printComments() {
    return this.state.comments.map((comment, key) => {
      return (
        <div
          key={key}
        >
          <Link
            to={"/posts/?id=" + comment.postId}
            className="list-group-item list-group-item-action list-group-item-dark rounded-lg"
            style={{ backgroundColor: "#f7f9fc", maxWidth: "100%", marginTop:"5px" }}
          >
            <div style = {{maxWidth: "100%", textOverflow: "ellipsis", overflow: "hidden"}}>{comment.text}</div>
          </Link>
        </div>
      );
    });
  }

  render() {
    if (!this.state || !this.state.comments) {
      return (
        <div>
          User loading...
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Navbar props={this.props} />
        <div className="text-center">
          <li>
            <ul> Name : {this.state.userData.name} </ul>
            <ul> Username : {this.state.userData.userName} </ul>
            <ul> Gender : {this.state.userData.gender} </ul>
            <ul> Age : {this.state.userData.age} </ul>
            <ul> City : {this.state.userData.from} </ul>
            <ul>
              <h3 style={{ textAlign: "left" }}> Comments:</h3>
            </ul>
          </li>
          <div style={{ marginLeft: "10px" }}>{this.printComments()}</div>
        </div>
      </div>
    );
  }
}
