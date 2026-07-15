import type { Interview } from '../types/interview'
import type { Transcript } from '../types/transcript'
import { demoDelay } from './demoDelay'
import { DemoServiceError } from './DemoServiceError'

export type TranscriptionProgressStage =
  | 'UPLOADING'
  | 'TRANSCRIBING'
  | 'PROCESSING_SPEAKERS'
  | 'COMPLETED'

export type TranscriptionResult = {
  transcript: Transcript
}

export const transcriptionProgressMessages: readonly string[] = [
  'Uploading interview recording...',
  'Transcribing interview audio...',
  'Processing interview speakers...',
  'Preparing transcript...',
]

export async function transcribeInterview(input: {
  interviewId: string
  interviews: Interview[]
  transcripts: Transcript[]
  delayMs?: number
}): Promise<TranscriptionResult> {
  const interview = input.interviews.find(
    (item) => item.id === input.interviewId,
  )

  if (!interview) {
    throw new DemoServiceError(
      'INTERVIEW_NOT_FOUND',
      `Interview ${input.interviewId} was not found.`,
    )
  }

  await demoDelay(input.delayMs ?? 2400)

  const transcript = input.transcripts.find(
    (item) => item.interviewId === interview.id,
  )

  if (!transcript) {
    throw new DemoServiceError(
      'TRANSCRIPT_NOT_FOUND',
      `Transcript for interview ${interview.id} was not found.`,
    )
  }

  return {
    transcript: {
      ...transcript,
      status: 'COMPLETED',
      segments: transcript.segments.map((segment) => ({ ...segment })),
    },
  }
}
