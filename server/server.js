const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  socket.on("join_room", (data) => {
    console.log(data)
    socket.join(data)
  })
  socket.on("send_message", (data) => {
    socket.join(data.room)
    console.log("Sent message :", data)
    socket.to(data.room).emit("receive_message", data.message)
  })
  socket.on('leave_room', (data) => {
    socket.leave(data)
    console.log("User disconnected", socket.id)

  });
})

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});