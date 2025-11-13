"use strict";

const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, "index.html");

const server = express()
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

// Track connected users
let userCount = 0;
let playerObjects = []; // Array to hold all player objects

io.on("connection", (socket) => {
  userCount++;
  console.log(
    `Client connected. Total users: ${userCount}, Socket ID: ${socket.id}`
  );

  // Broadcast to everyone that someone joined
  io.emit("hello!");
  // When a user draws, broadcast to everyone EXCEPT the sender
  socket.on("hello!", handleHello);

  socket.on("iamdrawing", (x, y, radius, name) => {
    socket.broadcast.emit("iamdrawing", x, y, radius, name);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    userCount--;
    console.log(`Client disconnected. Total users: ${userCount}`);
    console.log(
      "According to the io object, user count is " + io.engine.clientsCount
    );
    io.emit("disconnected", userCount);

    // Remove the disconnected player from the playerObjects array
    // How can I retrieve the disconnected socket.id?
  });

  function handleHello(n) {
    // Add an object containing the socket.id and player name to the playerObjects array
    playerObjects.push({
      id: socket.id,
      name: n,
    });
    console.log("Added player with name " + n);
    console.log(playerObjects);
  }
});
