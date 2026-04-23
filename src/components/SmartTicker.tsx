export default function SmartTicker() {
  return (
    <div className="bg-[#FF6B00] text-white text-sm font-medium py-2 overflow-hidden whitespace-nowrap z-20">
      <div className="inline-block animate-ticker">
        <span className="mx-8 uppercase">⚠️ CRANE 2: Monitoring wind gusts (38mph).</span>
        <span className="mx-8 uppercase">⚠️ NEW JACKSON: Concrete delivery 12 mins away.</span>
        <span className="mx-8 uppercase">✅ FLOOR 15: Fire Marshall inspection cleared.</span>
        {/* Duplicate for seamless looping */}
        <span className="mx-8 uppercase">⚠️ CRANE 2: Monitoring wind gusts (38mph).</span>
        <span className="mx-8 uppercase">⚠️ NEW JACKSON: Concrete delivery 12 mins away.</span>
        <span className="mx-8 uppercase">✅ FLOOR 15: Fire Marshall inspection cleared.</span>
      </div>
    </div>
  );
}
