import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { code: "", users: [] };
    }
    rooms[roomId].users.push(username);
    socket.emit("loadCode", rooms[roomId].code);
    io.to(roomId).emit("userJoined", { username, users: rooms[roomId].users });
  });

  socket.on("codeChange", ({ roomId, code }) => {
    rooms[roomId].code = code;
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("leaveRoom", ({ roomId, username }) => {
    socket.leave(roomId);
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user !== username
    );
    io.to(roomId).emit("userLeft", { username, users: rooms[roomId].users });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Collaboration server running on port 5000");
});
