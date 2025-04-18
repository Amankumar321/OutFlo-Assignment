export interface Campaign {
  _id: string
  name: string
  description: string
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  leads: string[]
  accountIDs: string[]
}
