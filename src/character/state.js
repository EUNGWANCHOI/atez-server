import { supabase } from "../db/supabaseClient.js";
import OpenAI from "openai";
import { config } from "../config/env.js";

const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });

const DEFAULT_STATE = {
  affection: 0,
  emotion: "neutral",
};

export async function getUserState(userId) {
  const { data } = await supabase
    .from("user_state")
    .select("affection, emotion")
    .eq("user_id", userId)
    .maybeSingle();

  return data || { ...DEFAULT_STATE };
}

async function saveUserState(userId, affection, emotion) {
  await supabase
    .from("user_state")
    .upsert({ user_id: userId, affection, emotion });
}

async function analyzeSentiment(message) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `다음 문장의 감정을 분류해. 결과는 하나만 선택해.
[긍정: happy], [호감: shy], [불쾌/부정: annoyed], [중립: neutral]
출력은 감정만. 설명 없이.`,
      },
      { role: "user", content: message },
    ],
  });

  return completion.choices[0].message.content.trim();
}

// 🔸 사용자 입력 기반 감정/호감도 업데이트
export async function updateState(userId, message) {
  const state = await getUserState(userId);
  let { affection, emotion } = state;

  // 1) 간단 키워드 기반 호감도
  if (message.includes("좋아해") || message.includes("보고싶")) {
    affection += 5;
  }
  if (message.includes("고마워") || message.includes("착하다")) {
    affection += 3;
  }
  if (message.includes("싫어") || message.includes("바보")) {
    affection -= 5;
  }

  // 2) 문맥 감정 분석
  const contextEmotion = await analyzeSentiment(message);

  // 중립 아닌 경우만 반영
  if (contextEmotion && contextEmotion !== "neutral") {
    emotion = contextEmotion;
  }

  // 3) 호감도 범위 제한
  affection = Math.max(0, Math.min(100, affection));

  // DB 저장
  await saveUserState(userId, affection, emotion);

  return { affection, emotion };
}
