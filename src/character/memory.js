import { supabase } from "../db/supabaseClient.js";

/** 특정 메시지를 기억해야 하는 상황인지 판단 */
function shouldSaveMemory(message) {
  //특정 키워드가 들어가면 기억
  const importantKeywords = [
    "좋아해요",
    "싫어해요",
    "힘들어요",
    "꿈",
    "취미",
    "과제",
    "시험",
    "부모님",
    "친구",
  ];

  return importantKeywords.some((k) => message.includes(k));
}

/** 기억 저장 */
export async function saveMemory(userId, message) {
  if (!shouldSaveMemory(message)) return;

  await supabase.from("memory").insert({
    user_id: userId,
    content: message,
    importance: 2,
  });
}

/** 대화 기억 읽어오기 */
export async function loadMemories(userId, limit = 5) {
  const { data } = await supabase
    .from("memory")
    .select("content")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];
  return data.map((m) => m.content);
}
