const express = require("express");
const api = express();
var moment = require('moment');
const cors = require("cors");
api.use(cors());
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/forum", { useNewUrlParser: true });
const Schema = mongoose.Schema;
const userSchema = new Schema({
  userName: String,
  password: String,
  name: String,
  age: Number,
  gender: String,
  from: String
});
const pageSchema = new Schema({
  path: String,
  component: String
});
const topicSchema = new Schema({
  name: String,
  numberOfContent: Number
});
const postSchema = new Schema({
  Topic: String,
  postHead: String,
  postBody: String,
  user: String,
  karma: Number,
  time: String
});
const commentSchema = new Schema({
  text: String,
  postId: String,
  parentId: String,
  user: String
});
var user = mongoose.model("users", userSchema);
var topic = mongoose.model("topics", topicSchema);
var post = mongoose.model("posts", postSchema);
var page = mongoose.model("pages", pageSchema);
var comment = mongoose.model("comments", commentSchema);
var admin = new user({
  userName: "Gurkan",
  password: "123",
  name: "String",
  age: 12,
  gender: "String",
  from: "String"
});
admin.save();

api.use(express.json());

api.use(express.urlencoded({ extended: true }));

api.post("/login", (req, res, next) => {
  user
    .find({
      userName: req.body.userName
    })
    .exec()
    .then(docs => {
      if (docs.length) {
        res.status(200).json({
          message: "success"
        });
      } else {
        res.status(200).json({
          message: "fail"
        });
      }
    });
});

api.post("/topics", (req, res, next) => {
  topic.find({}, function(err, topicss) {
    var topicMap = [];
    topicss.forEach(function(topi) {
      topicMap.push(topi);
    });
    res.json(topicMap);
  });
});

api.post("/take", (req, res, next) => {
  user
    .find({ userName: req.body.userName })
    .exec()
    .then(docs => {
      res.status(200).json(docs[0]);
    });
});

api.post("/userComments", (req,res,next) => {
  comment
    .find({user: req.body.userName})
    .exec()
    .then(docs => {
      res.json(docs);
      console.log(docs)
    })


})
api.post("/add", (req, res, next) => {
  user
    .find({ userName: req.body.userName })
    .exec()
    .then(docs => {
      if (docs.length) {
        res.status(200).json({
          message: "user already exist"
        });
      } else {
        var newUser = new user({
          userName: req.body.userName,
          password: req.body.password,
          name: req.body.name,
          age: req.body.age,
          gender: req.body.gender,
          from: req.body.from
        });
        newUser.save();
        res.status(200).json({
          message: "added"
        });
      }
    });
});

api.post("/posts", (req, res, next) => {
  post
    .find({ Topic: req.body.page })
    .exec()
    .then(docs => {
      res.json(docs);
    });
});

api.post("/findpost", (req, res, next) => {
  post
    .find({ _id: req.body._id })
    .exec()
    .then(docs => {
      res.json(docs[0]);
    });
});

api.post("/postUpvote", (req, res, next) => {
  post
    .find({ _id: req.body._id })
    .exec()
    .then(docs => {
      docs[0].karma = docs[0].karma + 1;
      docs[0].save();
      res.json(docs[0]);
    });
});

api.post("/postDownvote", (req, res, next) => {
  post
    .find({ _id: req.body._id })
    .exec()
    .then(docs => {
      docs[0].karma = docs[0].karma - 1;
      docs[0].save();
      res.json(docs[0]);
    });
});

api.post("/pages", (req, res, next) => {
  page.find({}, function(err, pages) {
    var pageMap = [];
    pages.forEach(function(pag) {
      pageMap.push(pag);
    });
    res.json(pageMap);
  });
});

api.post("/posts/:id", (req, res, next) => {
  const postAndComment = {
    post: {},
    comments: []
  };
  post
    .find({ _id: req.body.id })
    .exec()
    .then(docs => {
      postAndComment.post = docs[0];
      comment
        .find({ postId: req.body.id })
        .exec()
        .then(docs => {
          postAndComment.comments = docs;
          res.json(postAndComment);
        });
    });
});

api.post("/addPost", (req, res, next) => {
  var newPost = new post({
    Topic: req.body.Topic,
    postHead: req.body.postHead,
    postBody: req.body.postBody,
    user: req.body.user,
    karma: 0,
    time: moment().format()
  });
  newPost.save();
  res.status(200).json({
    message: "added"
  });
});

api.post("/deleteComment", (req, res, next) => {
  comment
    .find({ _id: req.body.id })
    .exec()
    .then(docs => {
      docs[0].text = "[deleted]";
      docs[0].save();
    });
});

api.post("/editComment", (req, res, next) => {
  comment
    .find({ _id: req.body.id })
    .exec()
    .then(docs => {
      docs[0].text = req.body.text;
      docs[0].save();
      res.status(200).json({
        message: "added"
      });
    });
});

api.post("/deletePost", (req, res, next) => {
  post
    .find({ _id: req.body.id })
    .exec()
    .then(docs => {
      docs[0].postBody = "[deleted]";
      docs[0].save();
    });
});

api.post("/editPost", (req, res, next) => {
  post
    .find({ _id: req.body.id })
    .exec()
    .then(docs => {
      docs[0].postBody = req.body.text;
      docs[0].save();
      res.status(200).json({
        message: "added"
      });
    });
});

api.post("/replyComment", (req, res, next) => {
  var newComment = new comment({
    text: req.body.text,
    user: req.body.user,
    postId: req.body.postId,
    parentId: req.body.parentId
  });
  newComment.save();
  res.status(200).json({
    message: "added"
  });
});

api.post("/addComment", (req, res, next) => {
  var newComment = new comment({
    text: req.body.text,
    user: req.body.user,
    postId: req.body.postId,
    parentId: "post"
  });
  newComment.save();
  res.status(200).json({
    message: "added"
  });
});

module.exports = api;
