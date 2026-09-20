import express from "express";
import cors from "cors";

const app = express();

// Middleware - Required to accept the Json data in body from client side
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// cors
app.use(cors());

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

export default app;
