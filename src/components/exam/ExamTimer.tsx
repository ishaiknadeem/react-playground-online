
import React from 'react';
import { Clock } from 'lucide-react';

interface ExamTimerProps {
  timeLeft: number;
  totalTime: number;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ timeLeft, totalTime }) => {
  const formatTime = (seconds: number): string => {
    if (seconds < 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    if (totalTime <= 0) return 'text-gray-400';
    
    const percentage = timeLeft / totalTime;
    if (percentage > 0.5) return 'text-green-400';
    if (percentage > 0.25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressPercentage = (): number => {
    if (totalTime <= 0) return 0;
    return Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
  };

  return (
    <div className="flex items-center space-x-3">
      <div className={`flex items-center space-x-2 font-mono text-lg ${getTimeColor()}`}>
        <Clock className="w-5 h-5" />
        <span>{formatTime(timeLeft)}</span>
      </div>
      
      {totalTime > 0 && (
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              getProgressPercentage() > 50 
                ? 'bg-green-400' 
                : getProgressPercentage() > 25 
                ? 'bg-yellow-400' 
                : 'bg-red-400'
            }`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ExamTimer;
