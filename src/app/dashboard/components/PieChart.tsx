'use client'
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  Title,
  ChartOptions,
} from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement, Title, ChartDataLabels);

type Camera = {
  cameraId: string;
  cameraName: string;
};

export default function PieChart({ token }: { token: string | undefined }) {
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
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setError(null);
    if (newFromDate && toDate && newFromDate > toDate) {
      setError('From date cannot be later than To date.');
    } else {
      setFromDate(newFromDate);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setError(null);
    if (fromDate && newToDate && fromDate > newToDate) {
      setError('To date cannot be earlier than From date.');
    } else {
      setToDate(newToDate);
    }
  };

  const refreshCameras = async () => {
    try {
      const response = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Camera', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const apiResponse = await response.json();
        const cameras: Camera[] = apiResponse.data;
        console.log(cameras);
        cameras.sort((a, b) => a.cameraName.localeCompare(b.cameraName));
        return cameras;
      } else {
        throw new Error('Failed to fetch cameras');
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const cameras = await refreshCameras();
        const queryParams = new URLSearchParams({
          ...(fromDate && { FromDate: fromDate }),
          ...(toDate && { ToDate: toDate }),
        });

        const recordPromises = cameras.map(camera =>
          fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Record?cameraId=${camera.cameraId}&${queryParams.toString()}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(records => records.totalNumberOfRecords)
        );


        const recordCounts = await Promise.all(recordPromises);
        console.log(recordCounts);

        const data = {
          labels: cameras.map(camera => camera.cameraName),
          datasets: [{
            label: 'Record Count',
            data: recordCounts,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            borderColor: [
              '#C70039', '#1F618D', '#F4D03F', '#16A085', '#8E44AD', '#E67E22'
            ],
            borderWidth: 1
          }]
        };

        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchChartData();
  }, [token, fromDate, toDate]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff', 
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((sum: number, val) => {
            return typeof val === 'number' ? sum + val : sum;
          }, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          return percentage;
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Record Count by Camera',
        font: {
          size: 14,
        },
      },
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-md shadow-md">
      <div className="flex justify-center mb-4 gap-x-2">
        <div className="flex flex-col items-center">
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleFromDateChange}
          />
        </div>
        <div className="flex flex-col items-center">
          <input
            type="date"
            id="toDate"
            value={toDate}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleToDateChange}
          />
        </div>
      </div>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <div className="w-full h-full md:w-96 md:h-96 lg:w-96 lg:h-96 xl:w-96 xl:h-96 mx-auto">
        {chartData.labels.length > 0 ? (
          <Pie data={chartData} options={options} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}