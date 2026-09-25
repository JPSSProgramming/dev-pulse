export interface MicroStep {
  id: string;
  title: string;
  completed: boolean;
  durationSeconds: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  steps: MicroStep[];
  createdAt: string;
}
