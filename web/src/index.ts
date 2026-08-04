import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDatabase from "./config/database";
import activityRoutes from "./routes/activity";
import balanceRoutes from "./routes/balance";
import userRoutes from "./routes/users";
import holdingsRoutes from "./routes/holdings";
import errorMiddleware from "./middlewares/helpers/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/activity", activityRoutes);
app.use("/balance", balanceRoutes);
app.use("/user", userRoutes);
app.use("/api/holdings", holdingsRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Central error handler — must be registered last.
app.use(errorMiddleware);

// Connect to MongoDB, then start the server.
// (Previously connectDatabase() was defined but never called — auth /
// holdings routes would have failed silently against no DB connection.)
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
