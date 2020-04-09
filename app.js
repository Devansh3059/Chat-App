var express = require("express");
var http = require("http");
var socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/users");

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const botName = "Chat Bot";

//Runs when there is a new Connection
io.on("connection", socket => {
  //connection is a event  socket is a parameter
  socket.on("joinRoom", ({ username, room }) => {
    //joinin in a particular room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //console.log("new connection");
    socket.emit("message", formatMessage(botName, "Welcome to Chat App")); //m1 emits the msg from here
    //socket.emit is to flash the msg only to new user

    //Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      ); //broadcast means this msg will flash to everybody except the user which connects

    //sending users and room info  1.when someone joins
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  //m2 Listen for chatMessage
  socket.on("chatMessage", mssg => {
    const user = getCurrentUser(socket.id);
    //c1 this contact in main.js
    io.to(user.room).emit("message", formatMessage(user.username, mssg));
  });

  //Runs when user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      ); //io.emit to flash the msg to everyone

      //sending users and room info  2.when someone leaves
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

//Routes
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/chat", function(req, res) {
  res.render("chat");
});

server.listen(5500 || process.env.PORT, process.env.IP, function() {
  console.log("Chat App Started");
});

// all emits like this (io.emit("message","a user has left the chat");)
//will see in web console
