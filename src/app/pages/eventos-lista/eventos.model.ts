export interface PaymentOption {
  id: 'pix_vista' | 'pix_parcelado' | 'cartao';
  label: string;
  description: string;
  value: number;
  installments?: number;
  pixKey?: string;
  url?: string;
}

export interface EventData {
  id: string;
  name: string;
  date: string;
  description: string;
  active: string; // "true" | "false"
  paymentOptions: PaymentOption[];
  createdAt?: string;
}