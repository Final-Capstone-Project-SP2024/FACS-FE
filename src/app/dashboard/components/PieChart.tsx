'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  Title,
  ChartOptions,
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

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Incident count by Location and Camera',
        font: {
          size: 14,
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-md">
      <div className="w-64 h-64 md:w-96 md:h-96 lg:w-64 lg:h-64 xl:w-96 xl:h-96 mx-auto">
        {chartData.labels.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}