import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./configs/mongodb.js";
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
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import axios from "axios";
import fileUpload from "express-fileupload";

// Import Routes
import quizRoutes from "./routes/quizRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

// Initialize Express & HTTP Server
const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database & Cloudinary
await connectDB();
await connectCloudinary();

const allowedOrigins = [
  "http://localhost:5173",
  "https://edemy-ai-integrated-smart-learning-platform.vercel.app",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Origin",
//       "X-Requested-With",
//     ],
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use(clerkMiddleware());

// Keep these essential middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Keep this!

// Then add fileUpload with proper configuration
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    useTempFiles: false,
    createParentPath: true,
  })
);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

// Routes
app.get("/", (req, res) => res.send("API working 🚀"));

// Clerk & Stripe Webhooks
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/payment", paymentRoutes);

// API Routes
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

// ========== CODE EXECUTION SETUP ==========

// Temp directory setup for local execution
const tempDir =
  process.env.NODE_ENV === "production" ? "/tmp" : path.join(__dirname, "temp");

if (!fs.existsSync(tempDir) && process.env.NODE_ENV !== "production") {
  fs.mkdirSync(tempDir);
}

// Language configurations
const languages = {
  c: { ext: "c", compile: "gcc", run: "temp" },
  cpp: { ext: "cpp", compile: "g++", run: "temp" },
  python: { ext: "py", run: "python3" },
  javascript: { ext: "js", run: "node" },
};

// Language mapping for Piston API
const pistonLanguages = {
  c: "c",
  cpp: "cpp",
  python: "python3",
  javascript: "javascript",
};

const executeCodeCloud = async (language, code) => {
  try {
    console.log("Attempting cloud execution for language:", language);
    const pistonLang = {
      c: "c",
      cpp: "cpp",
      python: "python3",
      javascript: "javascript",
    }[language];

    if (!pistonLang) {
      console.error("Unsupported language for cloud execution:", language);
      throw new Error("Unsupported language");
    }

    const payload = {
      language: pistonLang,
      version: "*",
      files: [
        {
          // This is the critical fix
          name: `main.${pistonLang}`,
          content: code,
        },
      ],
    };

    console.log("Sending to Piston API:", {
      language: pistonLang,
      codeLength: code.length,
    });

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      payload
    );
    console.log("Piston API response:", {
      status: response.status,
      data: response.data,
    });

    return (
      response.data.run?.output ||
      response.data.run?.stderr ||
      "Code executed but no output"
    );
  } catch (error) {
    console.error("Piston API error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });
    throw new Error(error.response?.data?.message || "Execution failed");
  }
};

// Local execution (for development)
const executeCodeLocal = (language, code) => {
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

// Unified execution endpoint
// In your server.js, replace the execute endpoint with this:

// Update the /api/execute endpoint
app.post("/api/execute", async (req, res) => {
  console.log("Execution request received:", {
    language: req.body.language,
    codeLength: req.body.code?.length,
  });

  try {
    let output;

    if (process.env.VERCEL === "1") {
      // More reliable than NODE_ENV for Vercel
      console.log("Using cloud execution (Vercel production)");
      output = await executeCodeCloud(req.body.language, req.body.code);
    } else {
      console.log("Using local execution (development)");
      output = await executeCodeLocal(req.body.language, req.body.code);
    }

    console.log("Execution successful. Output length:", output?.length);
    res.json({ success: true, output });
  } catch (err) {
    console.error("Execution failed:", {
      error: err.message,
      stack: err.stack,
    });
    res.json({
      success: false,
      error: err.message || "Unknown execution error",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
