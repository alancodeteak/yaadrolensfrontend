import { useEffect, useState } from 'react';

function formatClock(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/** Isolated live clock so the parent page does not re-render every second. */
const LiveAttendanceLiveClock = ({ active }) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [active]);

  if (!active) return null;
  return <> · {formatClock(currentTime)}</>;
};

export default LiveAttendanceLiveClock;
