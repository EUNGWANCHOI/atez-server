import express from "express";
import OpenAI from "openai";
import { supabase } from "../db/supabaseClient.js";
import { config } from "../config/env.js";
import { buildCharacterPrompt } from "../character/promptEngine.js";
import { updateState } from "../character/state.js";
import { saveMemory, loadMemories } from "../character/memory.js";

// 여기 추가
import {
  saveSituation,
  loadActiveSituation,
  clearSituation,
} from "../character/situation.js";
import { shouldSaveSituation } from "../character/shouldSaveSituation.js";

const router = express.Router();
const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { message } = req.body;
  const userId = "user-1";

  // 1. 상황 저장 판단
  if (shouldSaveSituation(message)) {
    await saveSituation(userId, "auto", message); // key는 자동 or 직접 지정 가능
  }

  // 2. 현재 상황 불러오기
  const situation = await loadActiveSituation(userId);

  // 3. 대화 기억 로딩
  const memories = await loadMemories(userId);

  // 4. RAG 검색
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });

  const { data: ragResults } = await supabase.rpc("match_documents", {
    query_embedding: embedding.data[0].embedding,
    match_count: 3,
  });

  const ragTexts = ragResults?.map((r) => r.content) || [];

  // 5. 감정 상태 업데이트
  const { affection, emotion } = updateState(message);

  // 6. 시스템 프롬프트 생성
  const systemPrompt = buildCharacterPrompt({
    ragTexts,
    affection,
    emotion,
    memories,
    situation,
  });

  // 7. GPT 호출
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0].message.content;

  // 8. 메모리 저장
  await saveMemory(userId, message);

  res.json({
    reply,
    affection,
    emotion,
    ragUsed: ragTexts,
    usedMemories: memories,
    situation,
  });
});

export default router;
