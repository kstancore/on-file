export type MissingSkill = {
  skill: string;
  importance: "critical" | "important" | "nice-to-have";
  evidence: string;
  howToClose: string;
};

export type ActionStep = {
  timeframe: string;
  action: string;
  why: string;
};

export type RejectionReason = {
  reason: string;
  detail: string;
};

export type AnalysisReport = {
  roleTitle: string;
  fitScore: number;
  verdict: string;
  toneRead: string;
  rejectionReasons: RejectionReason[];
  missingSkills: MissingSkill[];
  resumeGaps: string[];
  strengths: string[];
  actionPlan: ActionStep[];
  rewrittenBullets: string[];
  encouragement: string;
};

export const REPORT_STORAGE_KEY = "on-file:report";

export function saveReport(report: AnalysisReport) {
  try {
    sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(report));
  } catch {
    /* storage unavailable */
  }
}

export function loadReport(): AnalysisReport | null {
  try {
    const raw = sessionStorage.getItem(REPORT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalysisReport) : null;
  } catch {
    return null;
  }
}
