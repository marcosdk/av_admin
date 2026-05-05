export interface PaymentData {
  id: string;
  childName: string;
  cpf: string;
  eventName: string;
  eventId: string;
  paymentMethod: string;
  amount: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  fileUrl: string;
  notes?: string;
}