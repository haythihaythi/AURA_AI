export type CommunicationType =
  | 'APPLICATION_RECEIVED'
  | 'INTERVIEW_INVITATION'
  | 'NEXT_ROUND'
  | 'SELECTED'
  | 'REJECTED'

export type CommunicationStatus = 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED'

export type Communication = {
  id: string
  applicationId: string
  type: CommunicationType
  to: string
  subject: string
  body: string
  status: CommunicationStatus
  aiPersonalized: boolean
  sentAt?: string
}
