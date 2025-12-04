import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import chatRoute from "./routes/chatRoute.js";
import rateLimit from "express-rate-limit";

const app = express();

app.set("trust proxy", true);

app.use(
  "/chat",
  rateLimit({
    windowMs: 60 * 1000,
    max: 20,
  })
);

app.use(
  cors({
    origin: "https://atez-web.vercel.app",
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/chat", chatRoute);

app.listen(config.PORT, () => {
  console.log(`서버가 ${config.PORT} 포트에서 구동`);
});
