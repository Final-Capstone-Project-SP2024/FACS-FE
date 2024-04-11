'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from 'chart.js';

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement,
  Title,
);

type CameraData = {
  CameraName: string;
  Count: number;
};

type FetchedData = {
  Analysis: {
    [location: string]: CameraData[];
  };
};

export default function PieChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({ labels: [], datasets: [] });

  useEffect(() => {
    fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/FireDetection/locationAnalysis')
      .then(response => response.json())
      .then((data: FetchedData) => {
        const labels: string[] = [];
        const counts: number[] = [];
        const backgroundColors = [
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ];
        const borderColors = [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255,99,132,1)',
        ];

        Object.entries(data.Analysis).forEach(([location, cameras]) => {
          cameras.forEach((camera: CameraData) => {
            labels.push(`${location} (${camera.CameraName})`);
            counts.push(camera.Count);
          });
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Count',
              data: counts,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderColor: borderColors.slice(0, labels.length),
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Incident count by Location and Camera',
      },
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-md">
      {chartData.labels.length > 0 ? (
        <div className='flex-grow'> 
          <Pie data={chartData} options={options} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}