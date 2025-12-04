import express from "express";
import OpenAI from "openai";
import { supabase } from "../db/supabaseClient.js";
import { config } from "../config/env.js";
import { buildCharacterPrompt } from "../character/promptEngine.js";
import { updateState } from "../character/state.js";
import { saveMemory, loadMemories } from "../character/memory.js";
import { saveSituation, loadActiveSituation } from "../character/situation.js";

const router = express.Router();
const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { message } = req.body;
  const userId = "user-1";

  const memories = (await loadMemories(userId)) || [];

  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: message,
  });

  const { data: ragResults, error: ragError } = await supabase.rpc(
    "match_documents",
    {
      query_embedding: embedding.data[0].embedding,
      match_count: 3,
    }
  );

  if (ragError) {
    console.error("RAG ERROR:", ragError);
  }

  const ragTexts = ragResults?.map((r) => r.content) || [];

  const situation = (await loadActiveSituation(userId)) || null;

  const { affection, emotion } = updateState(message);

  const systemPrompt = buildCharacterPrompt({
    ragTexts,
    affection,
    emotion,
    memories,
    situation,
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0].message.content;

  await saveMemory(userId, message);

  res.json({
    reply,
    affection,
    emotion,
    ragUsed: ragTexts,
    usedMemories: memories, // 디버깅용: 어떤 기억 쓰였는지 확인
    situation,
  });
});

export default router;
