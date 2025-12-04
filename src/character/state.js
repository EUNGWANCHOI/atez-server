import { supabase } from "../db/supabaseClient.js";
import OpenAI from "openai";
import { config } from "../config/env.js";

const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });

const DEFAULT_STATE = {
  affection: 0,
  emotion: "neutral",
};

// 🔹 유저 상태 불러오기
export async function getUserState(userId) {
  const { data } = await supabase
    .from("user_state")
    .select("affection, emotion")
    .eq("user_id", userId)
    .maybeSingle();

  return data || { ...DEFAULT_STATE };
}

// 🔹 유저 상태 저장
async function saveUserState(userId, affection, emotion) {
  await supabase
    .from("user_state")
    .upsert({ user_id: userId, affection, emotion });
}

// 🔹 감정 분석 (OpenAI)
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

// 🔥 최적화: 감정 분석해야 할 문장인지 먼저 정규식으로 판단
function shouldAnalyzeSentiment(message) {
  const positive = /(좋아|보고싶|보고 싶|멋있|재밌|웃겼|귀엽)/;
  const negative = /(싫어|바보|짜증|화났|최악|별로)/;
  return positive.test(message) || negative.test(message);
}

// 🧠 최종 상태 업데이트 함수
export async function updateState(userId, message) {
  if (!message || typeof message !== "string") {
    return await getUserState(userId);
  }

  let { affection, emotion } = await getUserState(userId);

  // 🔸 키워드 기반 호감도 (즉시 적용, 비용 無)
  if (message.includes("좋아해") || message.includes("보고싶")) {
    affection += 5;
  }
  if (message.includes("고마워") || message.includes("착하다")) {
    affection += 3;
  }
  if (message.includes("싫어") || message.includes("바보")) {
    affection -= 5;
  }

  // 💎 최적화: 감정 분석이 필요할 때만 API 호출
  if (shouldAnalyzeSentiment(message)) {
    const contextEmotion = await analyzeSentiment(message);

    // 중립일 때는 변화 없음
    if (contextEmotion && contextEmotion !== "neutral") {
      emotion = contextEmotion;
    }
  }

  // 🔐 호감도 범위 제한
  affection = Math.max(0, Math.min(100, affection));

  // 💾 저장
  await saveUserState(userId, affection, emotion);

  return { affection, emotion };
}
