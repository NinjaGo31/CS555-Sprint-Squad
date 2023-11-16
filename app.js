import express from "express";
import { userRouter } from "./Routes/userRoutes.js";
import { scavengerRouter } from "./Routes/scavengerRoutes.js";
import cors from "cors"

const app = express();
// Global middleware
app.use(cors());
app.use(express.json());

// Parent routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/scavengerHunt", scavengerRouter);

// unhandled routes
app.all("*", (req, res, next) => {
  const err = new Error(`Cant find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  next(err);
});

// global error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.stauts = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
export { app };
