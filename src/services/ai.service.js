// services/aiService.js
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import AppError from "../utils/errors/appError.js";

export const getAIResponse = async (userText, chatHistory = [], opts = {}) => {
  const modelName = opts.model || "gpt-4o-mini";
  const temperature =
    typeof opts.temperature === "number" ? opts.temperature : 0.2;
  const maxTokens = opts.maxTokens || 1200;
  const historyLimit = opts.historyLimit || 60;

  const formatHistory = (history = []) => {
    const recent = history.slice(-historyLimit);
    return recent
      .map((m, i) => {
        const t = m.createdAt
          ? ` (${new Date(m.createdAt).toISOString()})`
          : "";
        const content =
          typeof m.content === "string" ? m.content : JSON.stringify(m.content);
        return `${i + 1}. [${m.role}]${t}: ${content}`;
      })
      .join("\n");
  };

  const safeParseJSONFromString = (txt) => {
    if (!txt || typeof txt !== "string") return null;
    try {
      return JSON.parse(txt);
    } catch (e) {}
    const findBalanced = (s, openChar, closeChar) => {
      const start = s.indexOf(openChar);
      if (start === -1) return null;
      let depth = 0;
      for (let i = start; i < s.length; i++) {
        if (s[i] === openChar) depth++;
        else if (s[i] === closeChar) depth--;
        if (depth === 0) {
          const slice = s.slice(start, i + 1);
          try {
            return JSON.parse(slice);
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    };
    return findBalanced(txt, "{", "}") || findBalanced(txt, "[", "]");
  };

  const RESPONSE_SCHEMA = `
Return ONLY a single valid JSON object with the exact keys described below.
Do NOT output ANY other prose, markdown, or explanation. If you cannot answer,
If the response is code, include it as a properly formatted multiline string
without escaping newlines (use raw newlines instead of \n).
return a valid JSON object with an "error" field (see examples).

Schema (exact keys):
{
  "response_text": string,
  "response_type": "text" | "code" | "json" | "image" | "file" | "table" | "other",
  "response_data": any | null,
  "actions": [
    { "type": string, "payload": any }
  ],
  "should_end": boolean,
  "language": string | null,
  "metadata": { any } | null,
  "error": null | { "code": string, "message": string }
}
`;

  const historyStr = formatHistory(chatHistory);

  const prompt = `
You are an assistant that produces structured JSON responses for a web frontend.
Treat the "userText" as the user's current request. Consider conversation context below.

IMPORTANT:
- Output MUST be strictly valid JSON (no leading/trailing text).
- Use the exact schema described in RESPONSE_SCHEMA.
- If you cannot fulfill the request, set the "error" property.

RESPONSE_SCHEMA:
${RESPONSE_SCHEMA}

CONVERSATION HISTORY (most recent up to ${historyLimit} items):
${historyStr || "(no history provided)"}

USER REQUEST:
"${userText}"
`;

  try {
    const { text: raw } = await generateText({
      model: openai(modelName),
      prompt,
      temperature,
      max_tokens: maxTokens,
    });

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = safeParseJSONFromString(raw);
    }

    if (!parsed) {
      throw new AppError(["AI response could not be parsed as JSON"], 502, {
        rawModelOutput: raw,
      });
    }

    const normalized = {
      response_text: parsed.response_text ?? "",
      response_type: parsed.response_type ?? "text",
      response_data: parsed.response_data ?? null,
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      should_end:
        typeof parsed.should_end === "boolean" ? parsed.should_end : false,
      language: parsed.language ?? null,
      metadata: parsed.metadata ?? null,
      error: parsed.error ?? null,
    };

    return { raw, json: normalized };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error("AI Service Error:", err);
    throw new AppError(["Failed to get AI response"], 502, { original: err });
  }
};
