const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./Routes/auth");
const menuRoutes = require("./Routes/menu");
const orderRoutes = require("./Routes/order");
const paymentRoutes = require("./Routes/payment");
const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);

    console.log(
      "CORS check - Origin:",
      origin,
      "Allowed:",
      allowedOrigins.includes(origin)
    );

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (
        process.env.NODE_ENV === "production" &&
        origin.includes("vercel.app")
      ) {
        console.log("Allowing Vercel origin in production:", origin);
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cookie",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Removed problematic options route - CORS middleware handles preflight automatically

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (process.env.NODE_ENV === "production") {
    res.header("Access-Control-Allow-Credentials", "true");

    res.header("Vary", "Origin, Access-Control-Request-Headers");

    if (
      origin &&
      (origin.includes("vercel.app") || origin.includes("localhost"))
    ) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  }

  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running" });
});

app.use((err, req, res, next) => {
  console.error("Error occurred:", {
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
  });

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Access denied",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler - must be last middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
