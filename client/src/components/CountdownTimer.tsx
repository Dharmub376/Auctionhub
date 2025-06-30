import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string;
  onExpire?: () => void;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, onExpire, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();
      return Math.max(0, difference);
    };

    const updateTimer = () => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
      
      if (time === 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, isExpired, onExpire]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getTimerColor = () => {
    if (isExpired) return 'text-red-600';
    if (timeLeft < 3600000) return 'text-red-500'; // Less than 1 hour
    if (timeLeft < 86400000) return 'text-amber-500'; // Less than 1 day
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Clock className={`h-4 w-4 ${getTimerColor()}`} />
      <span className={`font-mono font-semibold ${getTimerColor()}`}>
        {isExpired ? 'EXPIRED' : formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default CountdownTimer;