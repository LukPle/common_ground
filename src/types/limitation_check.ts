export type LimitationCheck = {
  limitation: string;
  status: 'Check' | 'Depending' | 'Violation';
  reasoning: string;
};
