import express, { Application, Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { globalErrorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app: Application = express();

const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
