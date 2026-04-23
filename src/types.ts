export type FloorStatus = 'completed' | 'wip' | 'active' | 'scheduled';

export interface FloorData {
  floor: number;
  status: FloorStatus;
  notes: string;
}

export type ViewMode = 'field' | 'pm';

export interface ProjectStats {
  health: 'On Track' | 'At Risk' | 'Off Track';
  laborCount: number;
  slabCycleDays: number;
  budgetSpent: number;
  budgetTotal: number;
}
