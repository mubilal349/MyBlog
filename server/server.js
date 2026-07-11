import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import axios from "axios";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// ================== USER MODEL ==================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ================== AUTH ROUTES ==================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================== GEMINI AI & CHAT ==================

// Initialize Gemini AI
let genAI = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log("Gemini AI initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    genAI = null;
  }
} else {
  console.warn("GEMINI_API_KEY not found. Using fallback responses.");
}

// Chat history
let chatHistory = [];

// Fallback responses
const fallbackResponses = [
  "I'd be happy to help with that!",
  "That's an interesting question. Let me think about it.",
  "I understand what you're asking. Here's what I can tell you...",
  "Thanks for your message! I'm here to assist you.",
  "I appreciate your question. Let me provide some information on that topic.",
];

// Fallback generator
function generateFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! How can I assist you today?";
  }
  if (lowerMessage.includes("llm")) {
    return "LLMs (Large Language Models) are AI models trained on massive amounts of text data to understand and generate human-like language.";
  }
  return fallbackResponses[
    Math.floor(Math.random() * fallbackResponses.length)
  ];
}

// Generate bot reply

async function generateBotReply(message) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        inputs: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      },
    );

    const result = response.data;

    // HuggingFace returns different formats sometimes
    if (Array.isArray(result)) {
      return result[0]?.generated_text || "I couldn't generate a response.";
    }

    if (result.generated_text) {
      return result.generated_text;
    }

    return "No response from AI.";
  } catch (err) {
    console.error("HuggingFace Error:", err.message);
    return "AI service error. Try again later.";
  }
}

// ================== SOCKET.IO ==================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("history", chatHistory);

  socket.on("chat.message", async (payload) => {
    const msg = {
      id: Date.now(),
      user: payload.user || "User",
      text: payload.text,
      time: new Date().toISOString(),
      fromBot: false,
    };

    chatHistory.push(msg);
    io.emit("chat.message", msg);

    try {
      const botReply = await generateBotReply(payload.text);

      const botMsg = {
        id: Date.now() + 1,
        user: "Gemini AI",
        text: botReply,
        time: new Date().toISOString(),
        fromBot: true,
      };

      chatHistory.push(botMsg);
      io.emit("chat.message", botMsg);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        user: "Gemini AI",
        text: "I'm experiencing technical difficulties. Please try again.",
        time: new Date().toISOString(),
        fromBot: true,
      };
      chatHistory.push(errorMsg);
      io.emit("chat.message", errorMsg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================== API ENDPOINTS ==================
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });
    const reply = await generateBotReply(prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    gemini_available: !!genAI,
  });
});

app.get("/test-gemini", async (req, res) => {
  if (!genAI) {
    return res.json({
      status: "unavailable",
      message: "Gemini not configured",
    });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    res.json({
      status: "success",
      message: "Gemini API is working",
      response: response.text(),
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Gemini test failed",
      error: error.message,
    });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI API: ${genAI ? "Available" : "Not available"}`);
});
