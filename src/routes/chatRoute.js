import express from "express";
import OpenAI from "openai";
import { config } from "../config/env.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "간단한 테스트 서버입니다." },
        { role: "user", content: userMessage },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GPT 호출 실패" });
  }
});

export default router;
