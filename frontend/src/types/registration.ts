export interface RegistrationData {
  inGameName: string;
  playerId: string;
  whatsappNumber: string;
}

export interface PaymentData {
  screenshot: File;
  uploadedAt: Date;
}

export type RegistrationFlowStep = 'idle' | 'registration' | 'payment' | 'confirmation';

export interface RegistrationFlowState {
  step: RegistrationFlowStep;
  registrationData: RegistrationData | null;
  paymentData: PaymentData | null;
}
