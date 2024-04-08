'use client'
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registering the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fetchData = async (url: string, token: string | undefined) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error('Failed to fetch data');
  }
};

export default function Chart({ token }: { token: string | undefined }) {
  const [chartData, setChartData] = useState<any>(null);

  const updateChartData = async (interval: string) => {
    try {
      const data = await fetchData(`https://firealarmcamerasolution.azurewebsites.net/${interval}`, token);
      console.log(data);
  
      let labels;
      if (interval === 'day') {
        labels = data.map((item: any) => item.Date);
      } else if (interval === 'month') {
        labels = data.map((item: any) => item.Month);
      } else if (interval === 'year') {
        labels = data.map((item: any) => item.Year);
      }
  
      const chartData = {
        labels,
        datasets: [
          {
            label: `Incident count by ${interval}`,
            data: data.map((item: any) => item.Count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };
      setChartData(chartData);
    } catch (error) {
      console.error(`Error fetching data by ${interval}:`, error);
    }
  };

  useEffect(() => {
    updateChartData('day');
  }, [token]);

  return (
    <div className="w-full h-96 bg-white p-4 rounded-md shadow-md">
      <div className="mb-4">
        <button onClick={() => updateChartData('day')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Day</button>
        <button onClick={() => updateChartData('month')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Month</button>
        <button onClick={() => updateChartData('year')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Year</button>
      </div>
      {chartData ? (
        <div className="w-full h-full">
          <Line data={chartData} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}
