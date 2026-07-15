export type DemoServiceErrorCode =
  | 'APPLICATION_NOT_FOUND'
  | 'EVALUATION_NOT_FOUND'
  | 'INTERVIEW_NOT_FOUND'
  | 'TRANSCRIPT_NOT_FOUND'
  | 'COMMUNICATION_NOT_FOUND'
  | 'SCREENING_RESULT_NOT_FOUND'
  | 'FINAL_EVALUATION_NOT_FOUND'
  | 'RUBRIC_NOT_FOUND'
  | 'INVALID_SERVICE_INPUT'

export class DemoServiceError extends Error {
  code: DemoServiceErrorCode

  constructor(code: DemoServiceErrorCode, message: string) {
    super(message)
    this.name = 'DemoServiceError'
    this.code = code
  }
}
