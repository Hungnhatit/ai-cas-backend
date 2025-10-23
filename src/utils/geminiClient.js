import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("⚠️ GEMINI_API_KEY chưa được thiết lập trong file .env");
}

// ✅ Khởi tạo client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default genAI;
