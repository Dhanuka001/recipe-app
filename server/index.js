require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const favoriteRoutes = require("./routes/favorites");

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/favorites", favoriteRoutes);

// Start
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
