// // Simple dedicated WebSocket server
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import cors from "cors";

// const app = express();
// app.use(
//   cors({
//     origin: [
//       "https://edemy-ai-integrated-smart-learning-platform.vercel.app", // Your Vercel frontend URL
//       "http://localhost:5173", // For local development
//     ],
//     credentials: true,
//   })
// );

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
//     methods: ["GET", "POST"],
//   },
// });

// // Track active rooms
// const activeRooms = new Map();

// io.on("connection", (socket) => {
//   console.log(`New connection: ${socket.id}`);

//   // Handle joining a room
//   socket.on("join-room", (roomId, username) => {
//     socket.join(roomId);

//     // Track users
//     if (!activeRooms.has(roomId)) {
//       activeRooms.set(roomId, new Set());
//     }
//     activeRooms.get(roomId).add(username);

//     // Notify others
//     socket.to(roomId).emit("user-joined", username);
//   });

//   // Handle code changes
//   socket.on("code-change", ({ roomId, code }) => {
//     socket.to(roomId).emit("receive-code", code);
//   });

//   // Handle language changes
//   socket.on("language-change", ({ roomId, language }) => {
//     socket.to(roomId).emit("receive-language", language);
//   });

//   // Clean up on disconnect
//   socket.on("disconnect", () => {
//     activeRooms.forEach((users, roomId) => {
//       if (users.has(socket.username)) {
//         users.delete(socket.username);
//         socket.to(roomId).emit("user-left", socket.username);
//       }
//       if (users.size === 0) activeRooms.delete(roomId);
//     });
//   });
// });

// const PORT = process.env.PORT || 3001;
// httpServer.listen(PORT, () => {
//   console.log(`⚡️ WebSocket server running on port ${PORT}`);
// });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: [
      "https://edemy-ai-integrated-smart-learning-platform.vercel.app",
      "http://localhost:5173",
      "https://edemy-ai-integrated-smart-learning.onrender.com",
    ],
    credentials: true,
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://edemy-ai-integrated-smart-learning-platform.vercel.app",
      "http://localhost:5173",
      "https://edemy-ai-integrated-smart-learning.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track active rooms
const activeRooms = new Map();

io.on("connection", (socket) => {
  console.log(`New connection from: ${socket.handshake.headers.origin}`);

  // Handle joining a room
  socket.on("join-room", (roomId, username) => {
    socket.join(roomId);
    socket.username = username; // Store username on socket

    // Track users
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    activeRooms.get(roomId).add(username);

    // Notify others
    socket.to(roomId).emit("user-joined", username);
    console.log(`${username} joined room ${roomId}`);
  });

  // Handle code changes
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-code", code);
    console.log(`Code updated in room ${roomId}`);
  });

  // Handle language changes
  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("receive-language", language);
    console.log(`Language changed to ${language} in room ${roomId}`);
  });

  // Clean up on disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`);
    activeRooms.forEach((users, roomId) => {
      if (users.has(socket.username)) {
        users.delete(socket.username);
        socket.to(roomId).emit("user-left", socket.username);
      }
      if (users.size === 0) activeRooms.delete(roomId);
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`⚡️ WebSocket server running on port ${PORT}`);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
