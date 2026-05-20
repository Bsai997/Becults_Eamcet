import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config.js";
import studentPerformanceDetails from "./routes/studentPerformanceDetails.js";

const app = express();


app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(compression());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "3mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student", collegeRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/student-details", studentPerformanceDetails);


// Serve frontend static files
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendDistPath));

// Catch-all: serve index.html for non-API routes (SPA support)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.use(errorHandler);

export default app;
