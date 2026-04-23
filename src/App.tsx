import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import FieldView from './components/FieldView';
import PMDashboard from './components/PMDashboard';
import SmartTicker from './components/SmartTicker';
import { FloorData, FloorStatus, ViewMode, ProjectStats } from './types';

const initialFloors = Array.from({ length: 60 }, (_, i) => {
  const floor = 60 - i; // Reversed so 60 is top, 1 is bottom
  let status: FloorStatus = 'scheduled';
  if (floor <= 35) status = 'completed';
  else if (floor <= 54) status = 'wip';
  else if (floor === 55) status = 'active';
  
  return {
    floor,
    status,
    notes: ''
  };
});

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('field');
  const [floors, setFloors] = useState<FloorData[]>(initialFloors);
  
  // Base stats that could change if active pouring is updated over time, etc.
  const [stats, setStats] = useState<ProjectStats>({
    health: 'On Track',
    laborCount: 248,
    slabCycleDays: 7.2,
    budgetSpent: 42.1,
    budgetTotal: 120
  });

  const handleUpdateFloor = (floorNumber: number, newStatus: FloorStatus, notes: string) => {
    setFloors(prev => prev.map(f => {
      if (f.floor === floorNumber) {
        return { ...f, status: newStatus, notes: notes ? notes : f.notes };
      }
      return f;
    }));
  };

  const completedCount = useMemo(() => floors.filter(f => f.status === 'completed').length, [floors]);
  const progressPercent = Math.round((completedCount / floors.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden h-screen">
      <Navigation viewMode={viewMode} setViewMode={setViewMode} />
      
      <main className="flex-1 overflow-hidden relative">
        {viewMode === 'field' ? (
          <FieldView 
            floors={floors} 
            onUpdateFloor={handleUpdateFloor}
            progressPercent={progressPercent}
          />
        ) : (
          <PMDashboard 
            stats={stats}
            floors={floors}
            progressPercent={progressPercent}
          />
        )}
      </main>

      <SmartTicker />
    </div>
  );
}
