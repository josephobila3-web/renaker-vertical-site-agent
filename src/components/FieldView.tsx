import { useState, useRef, useEffect } from 'react';
import { Mic, ClipboardList, Check, Circle, Loader2, X } from 'lucide-react';
import { FloorData, FloorStatus } from '../types';

interface FieldViewProps {
  floors: FloorData[];
  onUpdateFloor: (floor: number, status: FloorStatus, notes: string) => void;
  progressPercent: number;
}

export default function FieldView({ floors, onUpdateFloor, progressPercent }: FieldViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Modal state
  const [selectedFloor, setSelectedFloor] = useState<number>(55);
  const [selectedStatus, setSelectedStatus] = useState<FloorStatus>('active');
  const [notes, setNotes] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to active floor on mount
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-status="active"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, []);

  const getStatusColor = (status: FloorStatus) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20';
      case 'wip': return 'bg-[#FF6B00] border-orange-600 shadow-orange-500/20';
      case 'active': return 'bg-[#002D72] border-blue-900 animate-pulse shadow-blue-500/40';
      case 'scheduled': default: return 'bg-gray-300 border-gray-400';
    }
  };

  const getStatusLabel = (status: FloorStatus) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'wip': return 'WIP';
      case 'active': return 'Active Pour';
      case 'scheduled': default: return 'Scheduled';
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.start();
        setIsRecording(true);

        // Simulate transcrip generation after stopping, or auto stop after 2.5s for demo.
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
            setTranscript("Floor 55: Poured 40m3 of C50 concrete. Weather stable. Wind at 12mph.");
            
            // Stop tracks
            stream.getTracks().forEach(track => track.stop());
          }
        }, 2500);

      } catch (err) {
        console.error("Mic access denied or unavailable", err);
        // Fallback simulation if no mic available
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          setTranscript("Floor 55: Poured 40m3 of C50 concrete. Weather stable. Wind at 12mph.");
        }, 2500);
      }
    }
  };

  const handleSaveModal = () => {
    onUpdateFloor(selectedFloor, selectedStatus, notes);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col sm:flex-row relative bg-white">
      
      {/* Scrollable Floor List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory px-4 py-8 pb-32 sm:border-r border-gray-200"
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="text-center mb-6">
            <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Vertical Progress</h2>
            <div className="text-[#002D72] text-4xl font-black">{progressPercent}%</div>
          </div>

          {floors.map((f) => (
            <div 
              key={f.floor} 
              data-status={f.status}
              className={`snap-center flex items-center p-4 rounded-xl border-2 transition-all ${
                f.status === 'active' ? 'border-[#002D72] bg-blue-50/50 scale-105 my-4 shadow-lg' : 'border-transparent bg-gray-50'
              }`}
            >
              <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-b-4 ${getStatusColor(f.status)}`}>
                {f.floor}
              </div>
              <div className="ml-4 flex-1">
                <div className="text-lg font-bold text-gray-900">Floor {f.floor}</div>
                <div className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(f.status).split(' ')[0]}`} />
                  {getStatusLabel(f.status)}
                </div>
              </div>
              {f.status === 'completed' && <Check className="w-6 h-6 text-emerald-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Logger & Voice UI */}
      <div className="absolute sm:relative bottom-0 left-0 right-0 sm:w-96 bg-white sm:bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-200 p-6 flex flex-col items-center justify-end sm:justify-center pb-[env(safe-area-inset-bottom,1.5rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-none z-10 transition-all">
        
        {transcript && (
          <div className="w-full bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100 shadow-sm relative">
            <button onClick={() => setTranscript('')} className="absolute top-2 right-2 text-blue-400 hover:text-blue-600">
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm text-[#002D72] font-semibold mb-1">Latest Log:</p>
            <p className="text-gray-700 italic pr-4">"{transcript}"</p>
          </div>
        )}

        <div className="flex gap-4 items-center justify-center w-full max-w-sm relative">
          {/* Main Mic Button */}
          <button 
            onClick={handleMicClick}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full text-white shadow-xl transition-all ${
              isRecording 
                ? 'bg-red-500 scale-110 shadow-red-500/40 animate-pulse' 
                : 'bg-[#002D72] hover:bg-[#001D4A] shadow-[#002D72]/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isRecording ? <Loader2 className="w-8 h-8 animate-spin" /> : <Mic className="w-8 h-8" />}
            {isRecording && (
              <span className="absolute -inset-4 rounded-full border-2 border-red-500 animate-ping opacity-20"></span>
            )}
          </button>

          {/* Floating Clipboard Mode */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute left-[calc(50%+4rem)] flex items-center justify-center w-14 h-14 bg-white border-2 border-gray-200 text-gray-700 rounded-full shadow-lg hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          >
            <ClipboardList className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-400 text-xs font-semibold uppercase mt-6 tracking-wide">
          {isRecording ? 'Listening...' : 'Tap Mic to Log Progress'}
        </p>
      </div>

      {/* Manual Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#002D72] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Update Floor Status</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Floor</label>
                <select 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-[#002D72]"
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(Number(e.target.value))}
                >
                  {floors.map(f => (
                    <option key={f.floor} value={f.floor}>Floor {f.floor} ({getStatusLabel(f.status)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['scheduled', 'active', 'wip', 'completed'] as FloorStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-colors flex items-center justify-center ${
                        selectedStatus === status 
                          ? status === 'completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : status === 'active' ? 'border-[#002D72] bg-blue-50 text-[#002D72]'
                          : status === 'wip' ? 'border-[#FF6B00] bg-orange-50 text-orange-700'
                          : 'border-gray-500 bg-gray-100 text-gray-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-500'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Site Notes (Optional)</label>
                <textarea 
                  className="w-full border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-[#002D72] h-24 resize-none"
                  placeholder="e.g., Poured 40m3 of C50..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button 
                className="flex-1 py-3 px-4 font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 py-3 px-4 font-semibold text-white bg-[#002D72] hover:bg-[#001D4A] rounded-xl shadow-md transition-colors"
                onClick={handleSaveModal}
              >
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
