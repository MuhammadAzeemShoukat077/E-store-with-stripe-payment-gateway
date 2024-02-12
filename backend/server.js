const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");   
const cors = require("cors");
const { createPaymentIntent } = require("./controllers/paymentController");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

   
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://azeemshoukat000:azeem332@cluster0.z3yivyn.mongodb.net/?retryWrites=true&w=majority",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);

// Database connection events
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to the database");
});

// Routes
app.use("/auth", authRoutes);
app.post("/api/create-payment-intent", createPaymentIntent);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
