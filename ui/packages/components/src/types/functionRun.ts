import type { RawHistoryItem } from '@inngest/components/utils/historyParser';

export const functionRunStatuses = [
  'FAILED',
  'RUNNING',
  'QUEUED',
  'COMPLETED',
  'CANCELLED',
] as const;
const FunctionRunEndedStatuses = ['CANCELLED', 'COMPLETED', 'FAILED'] as const;
export type FunctionRunStatus = (typeof functionRunStatuses)[number];
export type FunctionRunEndStatus = (typeof FunctionRunEndedStatuses)[number];
export function isFunctionRunStatus(s: string): s is FunctionRunStatus {
  return functionRunStatuses.includes(s as FunctionRunStatus);
}

export type FunctionRun = {
  batchCreatedAt: Date | null;
  batchID: string | null;
  canRerun: boolean | null;
  endedAt: Date | null;
  functionID: string;
  history: RawHistoryItem[];
  id: string;
  name: string;
  output: string | null;
  startedAt: Date | null;
  status: FunctionRunStatus;
};

export const FunctionRunTimeField = {
  QueuedAt: 'QUEUED_AT',
  StartedAt: 'STARTED_AT',
  EndedAt: 'ENDED_AT',
} as const;
export type FunctionRunTimeField = (typeof FunctionRunTimeField)[keyof typeof FunctionRunTimeField];

export function isFunctionTimeField(s: string): s is FunctionRunTimeField {
  for (const value of Object.values(FunctionRunTimeField)) {
    if (value === s) {
      return true;
    }
  }

  return false;
}

export type Result = {
  data: string | null;
  error: {
    message: string;
    name: string | null;
    stack: string | null;
  } | null;
};
