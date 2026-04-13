const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const aiRoutes = require("./routes/aiRoutes");
const handoffRoutes = require("./routes/handoffRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const initChatSocket = require("./sockets/chatSocket");
const initHandoffSocket = require("./sockets/handoffSocket");
const { initVectorDB, getDocumentCount } = require("./vectorStore/mongoVectorClient");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  const origin = req.headers.origin || "*";

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

initChatSocket(io);
initHandoffSocket(io);
app.set("io", io);

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/handoff", handoffRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health/vector-db", async (req, res) => {
  try {
    const count = await getDocumentCount();
    res.json({
      success: true,
      status: "connected",
      documentCount: count,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: "error",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    console.log(`Using Groq model: ${groqModel}`);

    await connectDB();

    initVectorDB()
      .then(async () => {
        const count = await getDocumentCount();
        console.log(`Vector database initialized with ${count} documents`);
      })
      .catch((err) => {
        console.error("Vector DB initialization error:", err);
      });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
