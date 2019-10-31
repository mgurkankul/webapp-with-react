import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Moment from "moment"
export default class Topic extends React.Component {
  upvoted= false
  downvoted= false
  constructor() {
    super();
    const url = new URL(window.location.href);
    this.obj = { page: String };
    this.obj.page = url.searchParams.get("topic");
    this.state = {
      karmaa: true,
      visible: false,
      postHead: "",
      postBody: "",
      refresh: false,
      time: ""
    };
    this.upvotePost = this.upvotePost.bind(this);
    this.downvotePost = this.downvotePost.bind(this);
    this.openModal = this.openModal.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.changePost = this.changePost.bind(this);
  }
  componentDidMount() {
    Modal.setAppElement("body");
    fetch(this.props.serverPort + "/posts", {
      method: "POST",
      body: JSON.stringify(this.obj || {}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          postData: data,
          Topic: this.obj.page
        });
      });
  }

  componentDidUpdate() {
    if (this.state.refresh) {
      fetch(this.props.serverPort + "/posts", {
        method: "POST",
        body: JSON.stringify(this.obj || {}),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            postData: data,
            refresh: false
          });
        });
    }
  }
  componentWillUnmount() {
    var controller = new AbortController();
    controller.abort();
  }
  upvotePost(post) {
    var link
    if(this.upvoted){
      link = "/postDownvote"
      this.upvoted = false
    }
    else{
      link = "/postUpvote"
     this.upvoted = true
    } 
    fetch(this.props.serverPort + link, {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          karmaa: !this.state.karmaa,
          refresh: true
        });
      });
  }
  downvotePost(post) {
    var link
    if(this.downvoted){
      link = "/postUpvote"
      this.downvoted = false
    }
    else{
      link = "/postDownvote"
     this.downvoted = true
    } 
    fetch(this.props.serverPort + link, {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          karmaa: !this.state.karmaa,
          refresh: true
        });
      });
  }

  openModal() {
    this.setState({ visible: !this.state.visible, refresh: true });
  }
  submitPost(event) {
    fetch(this.props.serverPort + "/addPost", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(this.openModal);
  }

  changePost(event) {
    const { name, value} = event.target;
    this.setState({ [name]: value,
      user: this.props.data.userName});
  }
  render() {
    if (!this.state || !this.state.postData) {
      return <div>Post is loading...
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>;
    }
    return (
      <div>
        <Navbar props={this.props} />
        {this.props.data.logged && (
          <button className = "btn btn-success" style = {{marginLeft: "40px", marginTop: "40px"}} onClick={this.openModal}>New Post</button>
        )}
        <Modal
          isOpen={this.state.visible}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
        >
          <form
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Title</label>
              <input
                type="text"
                name="postHead"
                value={this.state.postHead}
                onChange={this.changePost}
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">Post</label>
              <textarea
                name="postBody"
                value={this.state.postBody}
                onChange={this.changePost}
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
              />
            </div>
            <button type="submit" onClick={this.submitPost}>
              Submit
            </button>
            <button type="submit" onClick={this.openModal}>
              Cancel
            </button>
          </form>
        </Modal>

        {this.state.postData.map((post, key) => {
          const postId = "/posts/?id=" + post._id;
          return (
            <div
              key={key}
              className="card text-center w-75 mb-3"
              style={{
                marginLeft: "300px",
                marginRight: "300px"
              }}
            >
              <div className="card-body rounded-lg" style={{ backgroundColor: "#f7f9fc"}}>
                <Link
                  to={postId}
                  className="list-group-item list-group-item-action list-group-item-dark rounded-lg" style = {{backgroundColor: "#f7f9fc"}}
                >
                  <h5 className="card-title">{post.postHead}</h5>
                  <p className="card-text">{post.postBody}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {Moment(post.time).fromNow()}
                    </small>
                  </p>
                </Link>
                
                <button
                  className="badge badge-dark"
                  style={{ float: "left", marginTop: "10px" }}
                  onClick={this.upvotePost.bind(this, post)}
                  disabled={!this.props.data.logged}
                >
                  ▲
                </button>
                <div style={{color: "black", fontSize: "18px", float: "left", marginLeft: "2px", marginRight:"2px", marginTop: "7px" }}> {post.karma} </div>
                <button
                  className="badge badge-dark"
                  style={{ float: "left", marginTop: "10px" }}
                  onClick={this.downvotePost.bind(this, post)}
                  disabled={!this.props.data.logged}
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
