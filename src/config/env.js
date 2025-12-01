import dotenv from "dotenv";
dotenv.config();

export const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  PORT: process.env.PORT || 3000,
};
