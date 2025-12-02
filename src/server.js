import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();

app.use(
  cors({
    origin: "*", // 개발 단계에서는 허용
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.use("/chat", chatRoute);

app.listen(config.PORT, () => {
  console.log(`서버가 ${config.PORT} 포트에서 구동`);
});
