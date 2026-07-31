import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnalysisReport } from "./analysis-types";

const filePart = z.object({
  name: z.string().max(200),
  mimeType: z.string().max(120),
  dataUrl: z.string().max(14_000_000),
});

const InputSchema = z.object({
  jobDescription: z.string().trim().max(30_000).optional().default(""),
  resumeText: z.string().trim().max(30_000).optional().default(""),
  rejectionEmail: z.string().trim().max(20_000).optional().default(""),
  files: z.array(filePart).max(3).optional().default([]),
});

const SYSTEM_PROMPT = `You are Nia, a sharp senior technical recruiter with 15 years of hiring experience.
You read a candidate's job description, resume and the rejection email they received, then explain — directly, specifically and without flattery — why they were most likely rejected and exactly what to fix.

Rules:
- Be concrete. Quote or paraphrase real details from the documents instead of generic advice.
- Never invent experience the candidate does not have.
- fitScore is an honest 0-100 estimate of resume-to-role fit.
- Keep every string tight: verdict under 60 words, each detail under 40 words.
- Reply with ONLY a JSON object, no markdown fences, matching this shape:
{
  "roleTitle": string,
  "fitScore": number,
  "verdict": string,
  "toneRead": string,
  "rejectionReasons": [{ "reason": string, "detail": string }],
  "missingSkills": [{ "skill": string, "importance": "critical" | "important" | "nice-to-have", "evidence": string, "howToClose": string }],
  "resumeGaps": [string],
  "strengths": [string],
  "actionPlan": [{ "timeframe": string, "action": string, "why": string }],
  "rewrittenBullets": [string],
  "encouragement": string
}
Give 3-5 rejectionReasons, 4-7 missingSkills, 3-5 resumeGaps, 2-4 strengths, 4-6 actionPlan items across timeframes (this week / 30 days / 90 days), and 3 rewrittenBullets that are improved versions of real resume bullets.`;

export const analyzeApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AnalysisReport> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured yet. Please try again later.");

    const hasText =
      data.jobDescription.length > 40 || data.resumeText.length > 40 || data.rejectionEmail.length > 20;
    if (!hasText && data.files.length === 0) {
      throw new Error("Add a job description, a resume and the rejection email first.");
    }

    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: [
          "JOB DESCRIPTION:\n" + (data.jobDescription || "(see attached files)"),
          "\n\nRESUME:\n" + (data.resumeText || "(see attached files)"),
          "\n\nREJECTION EMAIL:\n" + (data.rejectionEmail || "(see attached files)"),
          "\n\nAnalyse the rejection and return the JSON object.",
        ].join(""),
      },
    ];

    for (const f of data.files) {
      if (f.mimeType.startsWith("image/")) {
        content.push({ type: "image_url", image_url: { url: f.dataUrl } });
      } else {
        content.push({ type: "file", file: { filename: f.name, file_data: f.dataUrl } });
      }
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Nia's desk is swamped right now — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits are used up. Add credits to keep analysing.");
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Analysis failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Nia couldn't read those documents. Try pasting the text instead.");

    const parsed = JSON.parse(cleaned.slice(start, end + 1)) as AnalysisReport;
    return {
      roleTitle: parsed.roleTitle ?? "This role",
      fitScore: Math.max(0, Math.min(100, Math.round(Number(parsed.fitScore) || 0))),
      verdict: parsed.verdict ?? "",
      toneRead: parsed.toneRead ?? "",
      rejectionReasons: parsed.rejectionReasons ?? [],
      missingSkills: parsed.missingSkills ?? [],
      resumeGaps: parsed.resumeGaps ?? [],
      strengths: parsed.strengths ?? [],
      actionPlan: parsed.actionPlan ?? [],
      rewrittenBullets: parsed.rewrittenBullets ?? [],
      encouragement: parsed.encouragement ?? "",
    };
  });
