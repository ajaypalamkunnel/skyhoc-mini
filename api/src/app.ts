import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/routes/auth.routes";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(requestLoggerMiddleware);

app.get("/health", (_req, res) => {
  res.json({
      success: true,
      message: "Skyhoc API is running",
    });
});
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

export default app;