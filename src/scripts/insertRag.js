import OpenAI from "openai";
import { supabase } from "../db/supabaseClient.js";
import { config } from "../config/env.js";
import fs from "fs";
import path from "path";

const client = new OpenAI({ apiKey: config.OPENAI_API_KEY });

async function insertText(text) {
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  await supabase.from("rag_docs").insert({
    content: text,
    embedding: embedding.data[0].embedding,
  });

  console.log("Inserted:", text.slice(0, 30), "...");
}

async function run() {
  const ragDir = path.join(process.cwd(), "src", "data", "rag");
  const files = fs.readdirSync(ragDir);

  for (const file of files) {
    const filePath = path.join(ragDir, file);
    const text = fs.readFileSync(filePath, "utf8");

    const chunks = chunkText(text, 600);

    for (const chunk of chunks) {
      await insertText(chunk);
    }
  }

  console.log("모든 RAG 문서 업로드 완료!");
}

function chunkText(text, size = 500) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

run();
