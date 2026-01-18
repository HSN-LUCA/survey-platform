'use client';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  status?: 'excellent' | 'good' | 'needsImprovement';
}

export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  status = 'good',
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color based on status
  let color = '#F59E0B'; // default yellow
  if (status === 'excellent') {
    color = '#10B981'; // green
  } else if (status === 'needsImprovement') {
    color = '#EF4444'; // red
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
        {label && <div className="text-xs text-gray-600 mt-1">{label}</div>}
      </div>
    </div>
  );
}
