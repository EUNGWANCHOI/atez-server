import { supabase } from "../db/supabaseClient.js";

/** 새로운 상황 저장 (기존 active 상황은 자동 종료) */
export async function saveSituation(userId, key, description) {
  // 이전 상황 종료
  await supabase
    .from("situation")
    .update({ active: false })
    .eq("user_id", userId)
    .eq("active", true);

  // 새 상황 저장
  await supabase.from("situation").insert({
    user_id: userId,
    key,
    description,
    active: true,
  });
}

/** 현재 상황 불러오기 */
export async function loadActiveSituation(userId) {
  const { data } = await supabase
    .from("situation")
    .select("description")
    .eq("user_id", userId)
    .eq("active", true)
    .maybeSingle();

  return data ? data.description : null;
}

/** 상황 종료 */
export async function clearSituation(userId) {
  await supabase
    .from("situation")
    .update({ active: false })
    .eq("user_id", userId)
    .eq("active", true);
}
