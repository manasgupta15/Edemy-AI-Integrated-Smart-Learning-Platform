import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import { createServer } from "http";
import { Server } from "socket.io";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

// ✅ Import Routes
import quizRoutes from "./routes/quizRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

// Initialize Express & HTTP Server
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to Database & Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Middlewares
// app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // ✅ Allow frontend URL
    credentials: true, // ✅ Allow authentication cookies
  })
);
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// ✅ Routes
app.get("/", (req, res) => res.send("API working 🚀"));

// Clerk & Stripe Webhooks
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/payment", paymentRoutes);

// ✅ API Routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/quiz", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", commentRoutes);

// ✅ WebSockets for Real-Time Code Collaboration
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-code", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Live Code Execution API Without Docker
//! const tempDir = path.join(__dirname, "temp");
//! if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// const tempDir =
//   process.env.NODE_ENV === "production" ? "/tmp" : path.join(__dirname, "temp");
// if (!fs.existsSync(tempDir) && process.env.NODE_ENV !== "production") {
//   fs.mkdirSync(tempDir);
// }

// const languages = {
//   c: { ext: "c", compile: "gcc", run: "temp" },
//   cpp: { ext: "cpp", compile: "g++", run: "temp" },
//   python: { ext: "py", run: "python3" },
//   javascript: { ext: "js", run: "node" },
// };

// const executeCode = (language, code) => {
//   return new Promise((resolve, reject) => {
//     const langConfig = languages[language];
//     if (!langConfig) return reject(new Error("Unsupported language"));

//     const filePath = path.join(tempDir, `temp.${langConfig.ext}`);
//     fs.writeFileSync(filePath, code);

//     const executablePath = path.join(tempDir, langConfig.run);

//     let command = langConfig.compile
//       ? `${langConfig.compile} ${filePath} -o ${executablePath}`
//       : `${langConfig.run} ${filePath}`;

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error("Compilation Error:", stderr || error.message);
//         return reject(new Error(stderr || error.message));
//       }

//       // If compilation is successful, run the executable
//       if (langConfig.compile) {
//         const runCommand =
//           os.platform() === "win32" ? `${executablePath}.exe` : executablePath;
//         exec(runCommand, (runError, runStdout, runStderr) => {
//           if (runError) {
//             console.error("Execution Error:", runStderr || runError.message);
//             return reject(new Error(runStderr || runError.message));
//           }
//           resolve(runStdout);
//         });
//       } else {
//         resolve(stdout);
//       }
//     });
//   });
// };

// app.post("/api/execute", async (req, res) => {
//   const { language, code } = req.body;
//   try {
//     const output = await executeCode(language, code);
//     res.json({ success: true, output });
//   } catch (err) {
//     res.json({ success: false, error: err.message });
//   }
// });

const tempDir =
  process.env.NODE_ENV === "production" ? "/tmp" : path.join(__dirname, "temp");

// ✅ Only create temp directory locally
if (!fs.existsSync(tempDir) && process.env.NODE_ENV !== "production") {
  fs.mkdirSync(tempDir);
}

// ✅ Use correct Python command
const pythonCommand =
  process.env.NODE_ENV === "production" ? "python" : "python3";

const languages = {
  c: { ext: "c", compile: "gcc", run: "temp" },
  cpp: { ext: "cpp", compile: "g++", run: "temp" },
  python: { ext: "py", run: pythonCommand },
  javascript: { ext: "js", run: "node" },
};

const executeCode = (language, code) => {
  return new Promise((resolve, reject) => {
    const langConfig = languages[language];
    if (!langConfig) return reject(new Error("Unsupported language"));

    const filePath = path.join(tempDir, `temp.${langConfig.ext}`);
    fs.writeFileSync(filePath, code);

    const executablePath = path.join(tempDir, langConfig.run);

    let command = langConfig.compile
      ? `${langConfig.compile} ${filePath} -o ${executablePath}`
      : `${langConfig.run} ${filePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Compilation Error:", stderr || error.message);
        return reject(new Error(stderr || error.message));
      }

      if (langConfig.compile) {
        const runCommand =
          os.platform() === "win32" ? `${executablePath}.exe` : executablePath;
        exec(runCommand, (runError, runStdout, runStderr) => {
          if (runError) {
            console.error("Execution Error:", runStderr || runError.message);
            return reject(new Error(runStderr || runError.message));
          }
          resolve(runStdout);
        });
      } else {
        resolve(stdout);
      }
    });
  });
};

app.post("/api/execute", async (req, res) => {
  const { language, code } = req.body;
  try {
    const output = await executeCode(language, code);
    res.json({ success: true, output });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
