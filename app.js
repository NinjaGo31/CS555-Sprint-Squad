import express from "express";
import { userRouter } from "./Routes/userRoutes.js";
import { scavengerRouter } from "./Routes/scavengerRoutes.js";
const app = express();

app.use(cors());


// Global middleware
app.use(express.json());

// Parent routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/scavengerHunt", scavengerRouter);
app.get("/",(req,res)=>{
  res.send(200)
})

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
