}

# Atez Server v1

Atez Server는 캐릭터 기반 AI 채팅 서비스를 위한 백엔드 서버이다.
Atez Server is a backend system for a character-based AI chat service.

단순한 질의응답을 처리하는 서버가 아니라, 캐릭터 중심의 대화를 목표로 설계되었다.
Rather than handling simple question-and-answer interactions, it is designed around character-driven conversations.

캐릭터는 대화 중 기억, 감정 상태, 호감도, 상황 맥락을 유지한다.
The character maintains memory, emotional state, affection level, and situational context during conversations.

이를 통해 매 대화는 독립적인 응답이 아닌, 이전 흐름을 이어가는 상호작용이 된다.
This allows each response to build upon previous interactions instead of being stateless.

Atez Server는 캐릭터의 성격과 말투가 무너지지 않도록 엄격한 프롬프트 규칙을 적용한다.
Atez Server enforces strict prompt rules to prevent personality drift and maintain consistent speech patterns.

이 프로젝트는 캐릭터와 유저 간의 장기적인 관계 시뮬레이션을 핵심 목표로 한다.
The core goal of this project is long-term relationship simulation between the user and the character.

---

## 주요 기능 (Core Features)

### 캐릭터 중심 프롬프트 엔진

Character-Centric Prompt Engine

말투, 문장 길이, 표현 방식에 대한 엄격한 규칙을 적용한다.
Strict rules are enforced for tone, sentence length, and expression style.

캐릭터의 성격과 유저와의 관계 설정을 일관되게 유지한다.
The character’s personality and relationship dynamics are consistently maintained.

역할 붕괴나 메타 발언이 발생하지 않도록 설계되었다.
The system is designed to prevent role-breaking and meta responses.

---

### 감정 및 호감도 시스템

Emotion & Affection System

유저의 발화를 기반으로 호감도를 수치화하여 관리한다.
User affection is quantified and tracked based on conversation content.

캐릭터의 감정 상태는 neutral, happy, shy, annoyed 등으로 구분된다.
The character’s emotional state is categorized as neutral, happy, shy, annoyed, and more.

키워드 기반 로직과 선택적 LLM 감정 분석을 조합해 비용을 최적화했다.
Keyword-based logic is combined with optional LLM sentiment analysis for cost optimization.

---

### 대화 기억 시스템

Persistent Memory System

모든 대화를 저장하지 않고, 의미 있는 발화만 선별하여 저장한다.
Not all messages are stored; only meaningful interactions are selectively saved.

저장된 기억은 프롬프트에 주입되어 대화의 연속성을 유지한다.
Stored memories are injected into prompts to maintain conversational continuity.

기억 데이터는 Supabase를 통해 관리된다.
Memory data is managed using Supabase.

---

### 상황 인식 시스템

Situation Awareness System

유저의 발화에서 현재 상황을 감지한다.
The system detects the user’s current situation from messages.

공부 중, 이동 중, 대기 중 등의 맥락이 대화에 반영된다.
Contexts such as studying, traveling, or waiting are reflected in responses.

이를 통해 캐릭터의 반응이 더 자연스럽게 이어진다.
This enables more natural and context-aware character responses.

---

### RAG (Retrieval-Augmented Generation)

캐릭터 배경 정보를 벡터화하여 저장한다.
Character background information is embedded and stored as vectors.

OpenAI Embedding과 Supabase Vector DB를 사용한다.
OpenAI Embeddings and Supabase Vector DB are used.

매 대화마다 관련 설정만 검색해 성격과 세계관 일관성을 강화한다.
Relevant context is retrieved per message to reinforce personality and lore consistency.

---

### API 및 서버 설계

API & Server Design

Express 기반 REST API 구조로 설계되었다.
The server is built using an Express-based REST API architecture.

Rate Limit을 적용해 과도한 요청을 방지한다.
Rate limiting is applied to prevent excessive requests.

허용된 프론트엔드 도메인만 CORS를 통해 접근 가능하다.
CORS is restricted to approved frontend domains only.

환경 변수 기반 설정으로 배포 환경에 대응한다.
Environment-based configuration allows flexible deployment.

---

## 기술 스택 (Tech Stack)

Node.js와 Express를 사용해 서버를 구성했다.
The server is built with Node.js and Express.

OpenAI API를 사용해 응답 생성과 임베딩을 처리한다.
OpenAI API is used for response generation and embeddings.

Supabase는 데이터베이스, 벡터 검색, 상태 저장에 사용된다.
Supabase is used for database storage, vector search, and state persistence.

---

## 프로젝트 구조 (Project Structure)

```
src/
 ├─ server.js              # Express 서버 엔트리
 ├─ routes/
 │   └─ chatRoute.js       # 메인 채팅 엔드포인트
 ├─ character/
 │   ├─ promptEngine.js    # 캐릭터 프롬프트 생성
 │   ├─ state.js           # 감정 및 호감도 로직
 │   ├─ memory.js          # 대화 기억 관리
 │   └─ situation.js       # 상황 인식 로직
 ├─ db/
 │   └─ supabaseClient.js  # Supabase 클라이언트
 ├─ data/
 │   └─ rag/               # 캐릭터 배경 문서
 └─ config/
     └─ env.js             # 환경 변수 설정
```

---

## 실행 방법 (Running the Project)

필요한 패키지를 설치한다.
Install required dependencies.

```bash
npm install
npm run dev
```

서버는 기본적으로 3000번 포트에서 실행된다.
The server runs on port 3000 by default.

---

## 프로젝트 목적 (Purpose)

이 프로젝트는 LLM 기반 캐릭터가 인간적으로 느껴지기 위한 구조를 실험한다.
This project explores architectural approaches for making LLM-based characters feel more human.

장기 기억, 감정 상태, 상황 인식, 성격 제약을 결합한다.
It combines long-term memory, emotional state, situation awareness, and personality constraints.

캐릭터 중심 AI 서비스의 백엔드 프로토타입을 목표로 한다.
It serves as a backend prototype for character-driven AI services.

---

## Author

최은관
Eungwan Choi
