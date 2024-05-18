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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const updateChartData = async (interval: string, startDate?: string, endDate?: string) => {
    try {
      let data: any;

      if (interval === 'day') {
        data = await fetchData(`https://firealarmcamerasolution.azurewebsites.net/api/v1/FireDetection/${interval}`, token);
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          data = data.filter((item: any) => {
            const itemDate = new Date(item.Date);
            return itemDate >= start && itemDate <= end;
          });
        }
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
            borderColor: 'rgb(100 181 246)',
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

  useEffect(() => {
    if (startDate && endDate) {
      updateChartData('day', startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <select
          defaultValue="day"
          onChange={(e) => updateChartData(e.target.value)}
          className="flex-grow sm:flex-grow-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          <option value="day">Day</option>
          <option value="last7Days">Last Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className="flex-grow flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
            placeholder="End Date"
          />
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              updateChartData('day');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-300 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Clear
          </button>
        </div>
      </div>
      {chartData ? (
        <div className="flex-grow">
          <Line data={chartData} options={{ maintainAspectRatio: true }} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading chart data...</p>
      )}
    </div>
  );
}
