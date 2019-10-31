import React from "react";
import { Link } from "react-router-dom";

export default class Content extends React.Component {
  constructor() {
    super();
    this.getName = this.getName.bind(this);
  }
  componentDidMount() {
    fetch(this.props.props.serverPort + "/topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          topicData: data
        });
      });
  }
  getName(topic) {
    return "/topics/?topic=" + topic.name;
  }
  render() {
    if (!this.state || !this.state.topicData) {
      return (
        <div>
          Content is loading...
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div style = {{height: "calc(100vh - 54px", width: "100vh", margin: "0", padding: "0"}} className = "d-flex justify-content-start align-items-start container">
        <div 
          className="list-group" style = {{
             backgroundColor: "#f8f9fa"}}
        >
          <div
            className="list-head text-muted"
            style={{ textAlign: "left"}}
          >
           Sections 
          </div>
          <div className="list-group list-group-flush">
            {this.state.topicData.map((topic, key) => (
              <Link
                key={key}
                
                to={this.getName(topic)}
                className="list-group-item list-group-item-action"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
