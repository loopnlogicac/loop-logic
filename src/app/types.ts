import type { Lang, DiagnosisCode } from '../content/pricing-pack.ts';
import type { TaskInstance } from '../core/scenario.ts';
import type { AttemptSummary, Adaptation } from '../core/adaptation.ts';
import type { Diagnosis } from '../core/diagnosis.ts';
import type { GradeSignals } from '../core/grading.ts';

export type Phase = 'practice' | 'assessment' | 'complete';

export interface SessionRecord {
  id: string;
  learnerId: string;
  tenantId: string;
  lang: Lang;
  baseSeed: number;
  taskCounter: number;
  packVersion: string;
  phase: Phase;
  revision: number;
  current: TaskInstance;
  helpUsedOnCurrent: boolean;
  history: AttemptSummary[];
  lastDiagnosis: DiagnosisCode | null;
  readyForTransfer: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Everything behind one decision, for the "under the hood" panel. */
export interface TraceRecord {
  attemptId: string;
  taskId: string;
  level: number;
  signals: GradeSignals;
  diagnosis: Diagnosis;
  adaptation: Adaptation;
  verifierVersion: string;
  packVersion: string;
  facts: { salePrice: number; profit: number; markupPct: number; marginPct: number; requiredMarginPct: number; meetsPolicy: boolean };
}
