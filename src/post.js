import React from "react";
import Navbar from "./navbar";
import Modal from "react-modal";
import Moment from "moment"
export default class Post extends React.Component {
  upvoted= false
  downvoted= false
  constructor() {
    super();
    this.state = {
      postData: null,
      karmaa: true,
      refresh: false,
      newComment: "",
      visible: false,
      visible2: false,
      visible3: false,
      editComment: "",
      editPost: ""
    };
    this.upvotePost = this.upvotePost.bind(this);
    this.downvotePost = this.downvotePost.bind(this);
    this.changeComment = this.changeComment.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.printChild = this.printChild.bind(this);
    this.printComments = this.printComments.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.editComment = this.editComment.bind(this);
    this.openModal = this.openModal.bind(this);
    this.editPost = this.editPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.openModal2 = this.openModal2.bind(this);
    this.openModal3 = this.openModal3.bind(this);
    this.replyPost = this.replyPost.bind(this);
  }
  componentDidMount() {
    Modal.setAppElement("body");
    const url = new URL(window.location.href);
    const obj = { id: String };
    obj.id = url.searchParams.get("id");
    fetch(this.props.serverPort + "/posts/:id", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          postData: data.post,
          postComments: data.comments,
          refresh: false
        });
      });
  }

  componentWillUnmount() {
    var abortController = new AbortController();
    abortController.abort();
  }
  componentDidUpdate() {
    if (this.state.refresh) {
      const url = new URL(window.location.href);
      const obj = { id: String };
      obj.id = url.searchParams.get("id");
      fetch(this.props.serverPort + "/posts/:id", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            postData: data.post,
            postComments: data.comments,
            refresh: false
          });
        });
    }
  }
  upvotePost() {
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
      body: JSON.stringify(this.state.postData),
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
  downvotePost() {
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
      body: JSON.stringify(this.state.postData),
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

  changeComment(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, user: this.props.data.userName });
  }

  submitComment(event) {
    var obj = {
      text: this.state.newComment,
      postId: this.state.postData._id,
      parentId: "post",
      user: this.props.data.userName
    };
    fetch(this.props.serverPort + "/addComment", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(this.setState({ refresh: true }));
  }

  printChild(commentId) {
    return this.state.postComments.map((comment, key) => {
      if (comment.parentId === commentId) {
        return (
          <div style={{backgroundColor: "#f7f9fc", border:"none", borderLeft: "solid grey"}} className="list-group-item" key={key}>
            <div><div style= {{fontSize:"12px"}}className="text-muted">{comment.user}</div>{comment.text}</div>
            <div>
            {comment.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                onClick={this.deleteComment.bind(this, comment._id)}
              >
                Delete
              </button>
            )}
            {comment.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                onClick={this.openModal.bind(this, comment._id)}
              >
                Edit
              </button>
            )}
            <Modal isOpen={this.state.visible} contentLabel="Example Modal">
              <form
                onSubmit={event => {
                  event.preventDefault();
                }}
              >
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Comment</label>
                  <textarea
                    name="editComment"
                    value={this.state.editComment}
                    onChange={this.changeComment}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  />
                </div>
                <button type="submit" onClick={this.editComment}>
                  Submit
                </button>
                <button type="submit" onClick={this.openModal}>
                  Cancel
                </button>
              </form>
            </Modal>
            {this.props.data.logged && (
              <button
                className="badge badge-dark"
                onClick={this.openModal3.bind(this, comment._id)}
              >
                Reply
              </button>
            )}
            <Modal isOpen={this.state.visible3} contentLabel="Example Modal">
              <form
                onSubmit={event => {
                  event.preventDefault();
                }}
              >
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Reply</label>
                  <textarea
                    name="editComment"
                    value={this.state.editComment}
                    onChange={this.changeComment}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  />
                </div>
                <button type="submit" onClick={this.replyPost}>
                  Submit
                </button>
                <button type="submit" onClick={this.openModal3}>
                  Cancel
                </button>
              </form>
            </Modal>
            <div style={{ marginLeft: "20px" }}>
              {this.printChild(comment._id)}
            </div>
            </div>
          </div>
        );
      } else return null;
    });
  }
  printComments() {
    return this.state.postComments.map((comment, key) => {
      if (comment.parentId === "post") {
        return (
          <div  style={{backgroundColor: "#f7f9fc", border:"none", borderLeft: "solid grey"}} className="list-group-item" key={key}>
            <div><div style= {{fontSize:"12px"}} className="text-muted">{comment.user}</div>{comment.text}</div>
            <div>
            {comment.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                onClick={this.deleteComment.bind(this, comment._id)}
              >
                Delete
              </button>
            )}
            {comment.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                onClick={this.openModal.bind(this, comment._id)}
              >
                Edit
              </button>
            )}
            <Modal isOpen={this.state.visible} contentLabel="Example Modal">
              <form
                onSubmit={event => {
                  event.preventDefault();
                }}
              >
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Comment</label>
                  <textarea
                    name="editComment"
                    value={this.state.editComment}
                    onChange={this.changeComment}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  />
                </div>
                <button type="submit" onClick={this.editComment}>
                  Submit
                </button>
                <button type="submit" onClick={this.openModal}>
                  Cancel
                </button>
              </form>
            </Modal>
            {this.props.data.logged && (
              <button
                className="badge badge-dark"
                onClick={this.openModal3.bind(this, comment._id)}
              >
                Reply
              </button>
            )}
            <Modal isOpen={this.state.visible3} contentLabel="Example Modal">
              <form
                onSubmit={event => {
                  event.preventDefault();
                }}
              >
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">Reply</label>
                  <textarea
                    name="editComment"
                    value={this.state.editComment}
                    onChange={this.changeComment}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  />
                </div>
                <button type="submit" onClick={this.replyPost}>
                  Submit
                </button>
                <button type="submit" onClick={this.openModal3}>
                  Cancel
                </button>
              </form>
            </Modal>
            <div style={{ marginLeft: "20px" }}>
              {this.printChild(comment._id)}
            </div>
            </div>
          </div>
        );
      } else return null;
    });
  }

  deleteComment(commentId) {
    const obj = { id: commentId };
    fetch(this.props.serverPort + "/deleteComment", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(this.setState({ refresh: true }));
  }

  openModal(commentId) {
    this.setState({
      visible: !this.state.visible,
      id: commentId,
      refresh: true
    });
  }

  openModal3(commentId) {
    this.setState({
      visible3: !this.state.visible3,
      id: commentId,
      refresh: true
    });
  }
  replyPost() {
    const obj = {
      id: this.state.id,
      text: this.state.editComment,
      parentId: this.state.id,
      user: this.props.data.userName,
      postId: this.state.postData._id
    };
    fetch(this.props.serverPort + "/replyComment", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.openModal3();
      this.setState({ refresh: true, id: "", editComment: "" });
    });
  }

  editPost() {
    const obj = { id: this.state.postData._id, text: this.state.editPost };
    fetch(this.props.serverPort + "/editPost", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.openModal2();
      this.setState({ refresh: true, editPost: "" });
    });
  }
  deletePost() {
    const obj = { id: this.state.postData._id };
    fetch(this.props.serverPort + "/deletePost", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(this.setState({ refresh: true }));
  }

  editComment() {
    const obj = { id: this.state.id, text: this.state.editComment };
    fetch(this.props.serverPort + "/editComment", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.openModal();
      this.setState({ refresh: true, id: "", editComment: "" });
    });
  }
  openModal2() {
    this.setState({ refresh: true, visible2: !this.state.visible2 });
  }

  render() {
    if (!this.state.postComments || !this.state.postData) {
      return (
        <div>
          Selected post is loading...
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <Navbar props={this.props} />
        <div
          className="card w-75 mb-3 rounded"
          style={{
            marginTop: "100px",
            marginLeft: "300px",
            marginRight: "300px"
          }}
        >
          <div className="card-body" style={{ backgroundColor: "#f7f9fc" }}>
            <div className="list-group-item list-group-item-action list-group-item" style = {{backgroundColor: "#f7f9fc"}}>
              <h5 className="card-title">{this.state.postData.postHead}</h5>
              <p className="card-text">{this.state.postData.postBody}</p>
              <p className="card-text">
                <small className="text-muted">{Moment(this.state.postData.time).fromNow()}</small>
              </p>
            </div>
            <button
              className="badge badge-dark"
              style={{ float: "left", marginTop: "10px" }}
              onClick={this.upvotePost}
              disabled={!this.props.data.logged}
            >
              ▲
            </button>
            <div style={{color: "black", fontSize: "18px", float: "left", marginLeft: "2px", marginRight:"2px", marginTop: "7px" }}>
              {this.state.postData.karma}
            </div>
            <button
              className="badge badge-dark "
              style={{ float: "left", marginTop: "10px"}}
              onClick={this.downvotePost}
              disabled={!this.props.data.logged}
            >
              ▼
            </button>
            {this.state.postData.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                style={{ float: "right" }}
                onClick={this.openModal2}
                disabled={!this.props.data.logged}
              >
                Edit
              </button>
            )}
            <Modal isOpen={this.state.visible2} contentLabel="Example Modal">
              <form
                onSubmit={event => {
                  event.preventDefault();
                }}
              >
                <div className="form-group">
                  <label htmlFor="exampleFormControlTextarea1">PostBody</label>
                  <textarea
                    name="editPost"
                    value={this.state.editPost}
                    onChange={this.changeComment}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  />
                </div>
                <button type="submit" onClick={this.editPost}>
                  Submit
                </button>
                <button type="submit" onClick={this.openModal2}>
                  Cancel
                </button>
              </form>
            </Modal>

            {this.state.postData.user === this.props.data.userName && (
              <button
                className="badge badge-dark"
                style={{ float: "right" }}
                onClick={this.deletePost}
                disabled={!this.props.data.logged}
              >
                Delete
              </button>
            )}
          </div>
          <div style={{ color: "black", backgroundColor: "#f7f9fc"}}>
            <br />
            <br />
            <h5>Comments</h5>
            <ul className = "list-group">{this.printComments()}</ul>
          </div>
        </div>
        {this.props.data.logged && (
        <div
        className="rounded w-75 bg-dark text-white mb-3"
        style={{
          marginTop: "100px",
          marginLeft: "300px",
          marginRight: "120px",
          borderStyle: "solid",
          borderWidth: "5px",
          borderColor: "#343A40"
        }}
      >
        <label htmlFor="exampleFormControlTextarea1">Add Comment</label>
        <textarea
          name="newComment"
          value={this.state.newComment}
          onChange={this.changeComment}
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        />
        <button className = "badge badge-dark d-inline p-2 bg-light text-dark" type="submit" onClick={this.submitComment}>
          Submit
        </button>
      </div>
        )}

      </div>
    );
  }
}
