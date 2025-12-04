import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import chatRoute from "./routes/chatRoute.js";
import rateLimit from "express-rate-limit";

const app = express();

// 🔐 Proxy 신뢰 (Railway/Render/Vercel 필수)
app.set("trust proxy", 1);

app.use(
  "/chat",
  rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// 🌍 프론트 Vercel 도메인만 허용
app.use(
  cors({
    origin: ["https://atez-web.vercel.app"],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.use("/chat", chatRoute);

app.listen(config.PORT, () => {
  console.log(`🚀 서버 구동 중: PORT ${config.PORT}`);
});
