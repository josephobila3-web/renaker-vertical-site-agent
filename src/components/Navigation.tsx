import { Building2, Settings2, CloudRainWind } from 'lucide-react';
import { ViewMode } from '../types';

interface NavigationProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function Navigation({ viewMode, setViewMode }: NavigationProps) {
  return (
    <nav className="bg-[#002D72] text-white shadow-md z-10 relative">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
        
        <div className="flex items-center space-x-3 lg:space-x-4">
          <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF6B00]" />
          <span className="font-bold tracking-wider text-xl sm:text-2xl uppercase">Renaker</span>
          <select className="ml-2 sm:ml-4 bg-white/10 hover:bg-white/20 transition-colors border-none text-xs sm:text-sm font-medium rounded-md px-2 sm:px-3 py-1.5 focus:ring-2 focus:ring-[#FF6B00] outline-none cursor-pointer hidden md:block">
            <option className="text-gray-900" value="contour1">Contour Tower 1</option>
            <option className="text-gray-900" value="blade">The Blade</option>
            <option className="text-gray-900" value="three60">Three60</option>
            <option className="text-gray-900" value="colliers">Colliers Yard</option>
          </select>
        </div>

        {/* Manchester Weather Widget */}
        <div className="hidden lg:flex items-center gap-4 bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <CloudRainWind className="w-4 h-4 text-sky-300" />
            <span className="text-sm font-bold">12°C</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-xs font-medium text-gray-300">Wind: 14mph</span>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-xs font-medium text-gray-300">UV: Mod</span>
          <div className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Wind-Off Risk: Low
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-black/20 p-1 rounded-lg flex items-center shadow-inner">
            <button
              onClick={() => setViewMode('field')}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${
                viewMode === 'field' 
                  ? 'bg-white text-[#002D72] shadow-sm' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Field View
            </button>
            <button
              onClick={() => setViewMode('pm')}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all ${
                viewMode === 'pm' 
                  ? 'bg-white text-[#002D72] shadow-sm' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              PM Dashboard
            </button>
          </div>
          <button className="hidden sm:block p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings2 className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </nav>
  );
}
