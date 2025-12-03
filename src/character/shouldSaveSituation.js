export function shouldSaveSituation(message) {
  const keywords = [
    // 장소 / 이동
    "가는 중",
    "가는 길",
    "도착했어",
    "도착함",
    "카페",
    "학교",
    "공연장",
    "지하철",
    "버스",

    // 이벤트
    "공연",
    "콘서트",
    "시험",
    "면접",
    "파티",
    "행사",

    // 지속 감정
    "우울",
    "화나",
    "긴장",
    "떨려",

    // 행동 기반 상황
    "기다리는 중",
    "준비 중",
    "먹는 중",
    "공부 중",
  ];

  return keywords.some((k) => message.includes(k));
}
