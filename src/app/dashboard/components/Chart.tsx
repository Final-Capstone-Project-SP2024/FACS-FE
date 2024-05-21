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

type TimePeriod = 'day' | 'lastweek' | 'month' | 'year';

const handleGetRecords = async (
  token: string | undefined,
  filters: { status?: string; fromDate?: string; toDate?: string }
) => {
  const fromDate = filters.fromDate || '2020-01-01';
  const toDate = filters.toDate || '2030-01-01';

  let url = `https://firealarmcamerasolution.azurewebsites.net/api/v1/Record?Page=1&PageSize=100000&FromDate=${encodeURIComponent(fromDate)}&ToDate=${encodeURIComponent(toDate)}`;
  // console.log(url);
  if (filters.status) {
    url += `&Status=${encodeURIComponent(filters.status)}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const apiResponse = await res.json();
      // console.log(apiResponse.results);
      return apiResponse.results;
    } else {
      throw new Error('Failed to fetch records');
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
};

export default function Chart({ token }: { token: string | undefined }) {
  const [chartData, setChartData] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('day');
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setError(null);
    if (newStartDate && endDate && newStartDate > endDate) {
      setError('Start date cannot be later than end date.');
    } else {
      setStartDate(newStartDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setError(null);
    if (startDate && newEndDate && startDate > newEndDate) {
      setError('End date cannot be earlier than start date.');
    } else {
      setEndDate(newEndDate);
    }
  };

  const calculateDateRange = (timePeriod: TimePeriod) => {
    const now = new Date();
    let startDate;
    let endDate = now.toISOString().split('T')[0]; // End date is today

    switch (timePeriod) {
      case 'day':
        // startDate = endDate; // Start date is also today
        break;
      case 'lastweek':
        let lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      default:
        startDate = endDate; // Default to today
    }

    return { startDate, endDate };
  };

  const updateChartData = async (timePeriod: TimePeriod) => {
    try {
      // const { startDate, endDate } = calculateDateRange(timePeriod);

      const records = await handleGetRecords(token, {
        fromDate: startDate,
        toDate: endDate,
      });

      // Sort the records by date
      const sortedRecords = records.sort((a: any, b: any) => {
        const dateA = new Date(a.recordTime);
        const dateB = new Date(b.recordTime);
        return dateA.getTime() - dateB.getTime();
      });

      let chartLabels = [];
      let chartDataPoints = [];
      if (timePeriod === 'month') {
        const countsByMonth = sortedRecords.reduce((acc: { [key: string]: number }, record: any) => {
          const month = new Date(record.recordTime).getMonth();
          const year = new Date(record.recordTime).getFullYear();
          // console.log(month, year);
          const monthYearKey = `${year}-${String(month + 1).padStart(2, '0')}`;
          if (!acc[monthYearKey]) {
            acc[monthYearKey] = 0;
          }
          acc[monthYearKey] += 1;
          return acc;
        }, {});

        chartLabels = Object.keys(countsByMonth).sort();
        chartDataPoints = chartLabels.map(monthYearKey => countsByMonth[monthYearKey]);
      } else if (timePeriod === 'lastweek') {
        // Group records by each of the last 7 days
        const countsByDay = sortedRecords.reduce((acc: { [key: string]: number }, record: any) => {
          const date = new Date(record.recordTime).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += 1;
          return acc;
        }, {});

        for (let i = 6; i >= 0; i--) {
          const day = new Date();
          day.setDate(day.getDate() - i);
          const dayKey = day.toISOString().split('T')[0];
          chartLabels.push(dayKey);
          chartDataPoints.push(countsByDay[dayKey] || 0);
        }
      } else if (timePeriod === 'year') {
        const countsByMonth = sortedRecords.reduce((acc: { [key: string]: number }, record: any) => {
          const date = new Date(record.recordTime);
          const monthYearKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!acc[monthYearKey]) {
            acc[monthYearKey] = 0;
          }
          acc[monthYearKey] += 1;
          return acc;
        }, {});

        for (let i = 0; i < 12; i++) {
          const monthKey = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`;
          chartLabels.push(monthKey);
          chartDataPoints.push(countsByMonth[monthKey] || 0);
        }
      } else {
        const countsByDate = sortedRecords.reduce((acc: { [key: string]: number }, record: any) => {
          const date = new Date(record.recordTime).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += 1;
          return acc;
        }, {});

        chartLabels = Object.keys(countsByDate).sort();
        chartDataPoints = chartLabels.map(date => countsByDate[date]);
      }

      const data = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Record Count',
            data: chartDataPoints,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      setChartData(data);
    } catch (error) {
      console.error('Updating chart data failed:', error);
    }
  };
  useEffect(() => {
    if (startDate && endDate) {
      updateChartData(timePeriod);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    updateChartData(timePeriod);
  }, [token, timePeriod]);

  const options = {
    plugins: {
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
          className="flex-grow sm:flex-grow-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          <option value="day">Day</option>
          <option value="lastweek">Last Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <div className="flex-grow flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
            placeholder="End Date"
          />
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:border-gray-400 focus:ring focus:ring-gray-300 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Clear
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
      </div>
      {
        chartData ? (
          <div className="flex-grow">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading chart data...</p>
        )
      }
    </div >
  );
}
