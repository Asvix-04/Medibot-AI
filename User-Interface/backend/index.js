// src/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// 👇 ADD Razorpay SDK
const Razorpay = require("razorpay");

// 👇 Your existing route imports
const userRoutes = require("./routes/userRoutes");
const healthDataRoutes = require("./routes/healthDataRoutes");
const authRoutes = require("./routes/authRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount your existing routes
app.use("/api/users", userRoutes);
app.use("/api/health", healthDataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/chat", chatRoutes);

// 👇 Razorpay Initialization
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 👇 Create Razorpay Order Endpoint
/**
 * @route   POST /api/payment/create-order
 * @desc    Create a Razorpay order
 * @access  Public (but you can secure it later)
 */
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency || "INR",
      receipt: receipt || `rcptid_${Date.now()}`,
    };

    // Create order
    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error(
      "Error creating Razorpay order:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
});

// 👇 Test route
app.get("/", (req, res) => {
  res.send("Medibot API is running");
});

// 👇 Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
});

// 👇 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
