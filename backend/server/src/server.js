import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

// ==========================================
// APP
// ==========================================

const app = express();

const server = http.createServer(app);

// ==========================================
// ENVIRONMENT
// ==========================================

const PORT = process.env.PORT || 5001;

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/users", userRoutes);

app.use("/api/comments", commentRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
  });
});

// ==========================================
// SOCKET.IO
// ==========================================

io.on("connection", (socket) => {
  console.log("=================================");
  console.log("🔌 Socket connected");
  console.log("Socket ID:", socket.id);
  console.log("=================================");

  // ========================================
  // SEND CHAT HISTORY
  // ========================================

  socket.emit("history", []);

  // ========================================
  // CHATBOT MESSAGE
  // ========================================

  socket.on("chat.message", async (data) => {
    try {
      console.log("=================================");
      console.log("📩 Chatbot message received");
      console.log("Socket ID:", socket.id);
      console.log("Data:", data);
      console.log("=================================");

      // --------------------------------------
      // VALIDATE MESSAGE
      // --------------------------------------

      const text = data?.text?.trim();

      if (!text) {
        socket.emit("chat.error", {
          message: "Message cannot be empty.",
        });

        return;
      }

      // --------------------------------------
      // TYPING START
      // --------------------------------------

      socket.emit("chat.typing", {
        typing: true,
      });

      // --------------------------------------
      // GENERATE RESPONSE
      // --------------------------------------

      const lowerText = text.toLowerCase();

      let reply;

      // Hello
      if (
        lowerText.includes("hello") ||
        lowerText.includes("hi") ||
        lowerText.includes("hey")
      ) {
        reply = "Hello! 👋 Welcome to the website. How can I help you today?";
      }

      // Who are you
      else if (
        lowerText.includes("who are you") ||
        lowerText.includes("what are you")
      ) {
        reply =
          "I am your AI Chat Assistant 🤖. I can help you with questions about this website, development, SEO, and technology.";
      }

      // Website
      else if (lowerText.includes("website") || lowerText.includes("site")) {
        reply =
          "I can help you understand the features and technologies used on this website.";
      }

      // React
      else if (lowerText.includes("react")) {
        reply =
          "React is a JavaScript library for building user interfaces using reusable components and state management.";
      }

      // JavaScript
      else if (lowerText.includes("javascript") || lowerText.includes("js")) {
        reply =
          "JavaScript is a programming language widely used for web development. It powers interactive frontend applications and can also be used on the backend with Node.js.";
      }

      // Node.js
      else if (lowerText.includes("node") || lowerText.includes("nodejs")) {
        reply =
          "Node.js allows JavaScript to run on the server. It is commonly used with Express.js to build REST APIs and real-time applications.";
      }

      // Express
      else if (
        lowerText.includes("express") ||
        lowerText.includes("expressjs")
      ) {
        reply =
          "Express.js is a lightweight Node.js framework commonly used for building APIs, routes, middleware, and backend applications.";
      }

      // MongoDB
      else if (lowerText.includes("mongodb") || lowerText.includes("mongo")) {
        reply =
          "MongoDB is a NoSQL database that stores data in flexible JSON-like documents. It works very well with Node.js applications.";
      }

      // MERN
      else if (lowerText.includes("mern")) {
        reply =
          "MERN stands for MongoDB, Express.js, React, and Node.js. Together they provide a complete JavaScript-based full-stack development stack.";
      }

      // Socket.IO
      else if (
        lowerText.includes("socket") ||
        lowerText.includes("socket.io") ||
        lowerText.includes("realtime")
      ) {
        reply =
          "Socket.IO enables real-time, bidirectional communication between the browser and server. It is useful for chat applications, notifications, live updates, and real-time dashboards.";
      }

      // API
      else if (lowerText.includes("api")) {
        reply =
          "An API allows different parts of an application or different applications to communicate with each other. REST APIs commonly use HTTP methods such as GET, POST, PUT, and DELETE.";
      }

      // Backend
      else if (lowerText.includes("backend")) {
        reply =
          "The backend handles server-side logic, authentication, databases, APIs, validation, and communication with frontend applications.";
      }

      // Frontend
      else if (lowerText.includes("frontend")) {
        reply =
          "The frontend is the part of an application users interact with. Technologies such as React, HTML, CSS, and JavaScript are commonly used to build it.";
      }

      // SEO
      else if (lowerText.includes("seo")) {
        reply =
          "SEO stands for Search Engine Optimization. It involves improving website structure, content, performance, metadata, accessibility, and other factors to help search engines understand and rank pages.";
      }

      // SEO
      else if (lowerText.includes("seo")) {
        reply =
          "SEO stands for Search Engine Optimization. It involves improving website structure, content, performance, metadata, accessibility, and other factors to help search engines understand and rank pages.";
      }

      // TECHNOLOGY
      else if (lowerText.includes("technology") || lowerText.includes("tech")) {
        reply =
          "Technology is the use of scientific knowledge, tools, software, hardware, and systems to solve problems and improve the way we work and communicate. Modern technologies include web development, cloud computing, cybersecurity, artificial intelligence, databases, DevOps, and mobile development.";
      }

      // AI
      else if (
        lowerText.includes("ai") ||
        lowerText.includes("artificial intelligence") ||
        lowerText.includes("machine learning")
      ) {
        reply =
          "AI, or Artificial Intelligence, enables computers and software to perform tasks that normally require human intelligence, such as understanding language, analyzing data, recognizing images, generating content, and making predictions. Modern AI includes machine learning, deep learning, generative AI, large language models, computer vision, and natural language processing.";
      }

      // Help
      else if (
        lowerText.includes("help") ||
        lowerText.includes("can you help")
      ) {
        reply =
          "Absolutely! 🤖 You can ask me about the website, React, Node.js, Express, MongoDB, MERN, APIs, Socket.IO, SEO, or general web development.";
      }

      // Thanks
      else if (lowerText.includes("thank") || lowerText.includes("thanks")) {
        reply =
          "You're very welcome! 😊 Let me know if you need anything else.";
      }

      // Bye
      else if (lowerText.includes("bye") || lowerText.includes("goodbye")) {
        reply = "Goodbye! 👋 Have a great day. Feel free to come back anytime.";
      }

      // Default response
      else {
        reply = `I received your message: "${text}". 🤖 I am currently running in basic assistant mode. You can ask me about React, Node.js, Express, MongoDB, MERN, Socket.IO, APIs, SEO, or this website.`;
      }

      // --------------------------------------
      // SIMULATE AI THINKING
      // --------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 700));

      // --------------------------------------
      // SEND BOT RESPONSE
      // --------------------------------------

      socket.emit("chat.message", {
        id: `bot-${Date.now()}`,
        user: "AI Assistant",
        text: reply,
        fromBot: true,
      });

      console.log("🤖 Chatbot response sent");

      // --------------------------------------
      // STOP TYPING
      // --------------------------------------

      socket.emit("chat.typing", {
        typing: false,
      });
    } catch (error) {
      console.error("❌ Chatbot error:", error);

      socket.emit("chat.typing", {
        typing: false,
      });

      socket.emit("chat.error", {
        message: "Something went wrong while processing your message.",
      });
    }
  });

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", (reason) => {
    console.log("=================================");
    console.log("❌ Socket disconnected");
    console.log("Socket ID:", socket.id);
    console.log("Reason:", reason);
    console.log("=================================");
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// ==========================================
// START SERVER
// ==========================================

server.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Client URL: ${CLIENT_URL}`);
  console.log(`🤖 Chatbot Socket.IO ready`);
  console.log("=================================");
});
