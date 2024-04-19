'use client';
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

type DataItem = {
  Date: string;
  Count: number;
};

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

const getLast7DaysData = (data: any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7DaysDate = new Date(today);
  last7DaysDate.setDate(today.getDate() - 7);

  const last7DaysData: DataItem[] = [];
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(last7DaysDate);
    date.setDate(last7DaysDate.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  dates.forEach(date => {
    const item = data.find((d: any) => {
      const itemDate = new Date(d.Date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.toISOString().split('T')[0] === date;
    });

    if (item) {
      last7DaysData.push({ Date: date, Count: item.Count });
    } else {
      last7DaysData.push({ Date: date, Count: 0 });
    }
  });

  return last7DaysData;
};

export default function Chart({ token }: { token: string | undefined }) {
  const [chartData, setChartData] = useState<any>(null);
  const [fetchedDayData, setFetchedDayData] = useState<any>(null);

  const updateChartData = async (interval: string) => {
    try {
      let data: any;

      if (interval === 'day') {
        data = await fetchData(`https://firealarmcamerasolution.azurewebsites.net/api/v1/FireDetection/${interval}`, token);
        setFetchedDayData(data);
      } else if (interval === 'last7Days') {
        if (fetchedDayData) {
          data = getLast7DaysData(fetchedDayData);
        } else {
          console.error("No data fetched for 'day' interval.");
          return;
        }
      } else {
        data = await fetchData(`https://firealarmcamerasolution.azurewebsites.net/api/v1/FireDetection/${interval}`, token);
      }

      let labels;

      if (interval === 'day' || interval === 'last7Days') {
        labels = data.map((item: any) => {
          const date = new Date(item.Date);
          return date.toISOString().split('T')[0];
        });

      } else if (interval === 'month') {
        labels = data.map((item: any) => {
          const date = new Date(item.Month);
          return date.toISOString().split('T')[0];
      });

      } else if (interval === 'year') {
        labels = data.map((item: any) => {
          const date = new Date(item.Year);
          return date.toISOString().split('T')[0];
      });
      }

      const chartData = {
        labels,
        datasets: [
          {
            label: `Incident count by ${interval}`,
            data: data.map((item: any) => item.Count),
            fill: false,
            borderColor: 'rgb(252 165 165)',
            tension: 0.1,
          },
        ],
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
    <div className="w-full h-96 bg-white p-4 rounded-md shadow-md flex flex-col">
      <div className="mb-4 flex flex-wrap">
        <button onClick={() => updateChartData('day')} className="mr-2 px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-md">Day</button>
        <button onClick={() => updateChartData('last7Days')} className="mr-2 px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-md">Last Week</button>
        <button onClick={() => updateChartData('month')} className="mr-2 px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-md">Month</button>
        <button onClick={() => updateChartData('year')} className="mr-2 px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-md">Year</button>
      </div>
      {chartData ? (
        <div className="flex-grow">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}
