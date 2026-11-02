require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const feedbackRoutes = require("./route/feedbackRoutes");
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Student Feedback Management API is running");
});

app.use("/api/feedback", feedbackRoutes);

app.listen(process.env.PORT || 5050, () => {
  console.log(`Server running on port ${process.env.PORT || 5050}`);
});
