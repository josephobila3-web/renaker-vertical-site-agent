import { useMemo } from 'react';
import { 
  CheckCircle2, 
  Users, 
  Clock, 
  PoundSterling,
  AlertTriangle,
  HardHat,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { FloorData, ProjectStats } from '../types';

interface PMDashboardProps {
  stats: ProjectStats;
  floors: FloorData[];
  progressPercent: number;
}

const logisticsData = [
  { day: 'Mon', Concrete: 120, Rebar: 40, Glass: 10 },
  { day: 'Tue', Concrete: 80, Rebar: 60, Glass: 20 },
  { day: 'Wed', Concrete: 150, Rebar: 30, Glass: 15 },
  { day: 'Thu', Concrete: 90, Rebar: 50, Glass: 25 },
  { day: 'Fri', Concrete: 110, Rebar: 45, Glass: 30 },
];

const issues = [
  { id: 1, text: "Crane 2 sensor fault - Technician required", severity: "high", time: "10:42 AM" },
  { id: 2, text: "Floor 42 material hoist delayed by 1hr", severity: "medium", time: "09:15 AM" },
  { id: 3, text: "Concrete batch #441 rejected upon test", severity: "high", time: "Yesterday" }
];

const staff = [
  { id: 1, name: "O'Neil Groundworks", headcount: 45, role: "Concrete & Rebar" },
  { id: 2, name: "Titan Glazing Ltd", headcount: 32, role: "Facade Installers" },
  { id: 3, name: "Apex MEP", headcount: 68, role: "Mechanical/Electrical" },
  { id: 4, name: "Renaker Core Team", headcount: 24, role: "Site Management" },
];

export default function PMDashboard({ stats, floors, progressPercent }: PMDashboardProps) {
  
  // Basic calculation. In a real app we'd map floors states to the budget or cycle changes.
  const activeFloor = useMemo(() => floors.find(f => f.status === 'active')?.floor || 'N/A', [floors]);
  
  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Stats */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#002D72]">Project Overview</h1>
            <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Contour Tower 1 • Active Pour: Floor {activeFloor}</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-4xl font-black text-[#FF6B00]">{progressPercent}%</div>
            <div className="text-sm font-bold text-gray-500 uppercase">Overall Progress</div>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Project Health</h3>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.health}</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Labor Count</h3>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.laborCount} <span className="text-sm font-medium text-gray-500">On-Site</span></p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Slab Cycle</h3>
              <Clock className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">{stats.slabCycleDays} <span className="text-sm font-medium text-gray-500">days/floor</span></p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Budget Tracker</h3>
              <PoundSterling className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-3">£{stats.budgetSpent}M <span className="text-sm font-medium text-gray-500">/ £{stats.budgetTotal}M</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#002D72]">Material Deliveries (Expected)</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={logisticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="Concrete" stackId="a" fill="#002D72" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Rebar" stackId="a" fill="#FF6B00" />
                  <Bar dataKey="Glass" stackId="a" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column Layout */}
          <div className="space-y-6">
            
            {/* Issue Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#002D72]">Flagged Issues</h2>
                <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{issues.length} Active</div>
              </div>
              <div className="space-y-3">
                {issues.map(issue => (
                  <div key={issue.id} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 items-start">
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${issue.severity === 'high' ? 'text-red-500' : 'text-orange-500'}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{issue.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{issue.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Oversight */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#002D72]">Staff Oversight</h2>
                <HardHat className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {staff.map(team => (
                  <div key={team.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{team.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{team.role}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-[#002D72]">{team.headcount}</span>
                      <span className="text-xs font-semibold text-gray-400">pax</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
