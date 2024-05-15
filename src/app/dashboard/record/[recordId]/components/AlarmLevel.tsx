import React from 'react';

type AlarmLevelProps = {
    levelText: string;
};

const WifiSignal = ({ levelText }: AlarmLevelProps) => {
    const level = parseInt(levelText.replace(/[^\d]/g, ''), 10);
  
    const totalBars = 5;
    const barWidth = 30;
    const barSpacing = 3;
    const barHeightIncrement = (160 - 10) / (totalBars - 1);
    const baseHeight = 30;
  
    const bars = Array.from({ length: totalBars }, (_, i) => {
      const height = baseHeight + (i * barHeightIncrement);
      const y = 160 - height;
      const x = i * (barWidth + barSpacing) + 10;
      const fill = i < level ? '#3b82f6' : '#e6e6e6';
      return <rect key={i} x={x} y={y} width={barWidth} height={height} fill={fill} />;
    });
  
    return (
      <svg height="160" width={(barWidth + barSpacing) * totalBars + 10}>
        {bars}
      </svg>
    );
  };

  export default function AlarmLevel({ levelText }: AlarmLevelProps) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-lg font-bold mb-4">Alarm Level</h1>
        <WifiSignal levelText={levelText} />
      </div>
    );
  }