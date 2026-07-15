export type SpeakerType = 'INTERVIEWER' | 'CANDIDATE' | 'UNKNOWN'

export type TranscriptSegment = {
  id: string
  sequenceNo: number
  speakerName: string
  speakerType: SpeakerType
  startMs: number
  endMs: number
  text: string
}

export type Transcript = {
  id: string
  interviewId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  languageCode: string
  fullText: string
  segments: TranscriptSegment[]
}
