'use client'
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function Chart({ token }: { token: string | undefined }) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state

  const handleGetRecord = async () => {
    setLoading(true); // Set loading state to true while fetching data

    const chartLabels: string[] = [];
    const totalNumberOfRecords: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const res = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/Record?Page=1&PageSize=10000&Status=InFinish&FromDate=${dateString}&ToDate=${dateString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const apiResponse = await res.json();
        console.log(apiResponse)
        chartLabels.push(dateString);
        totalNumberOfRecords.push(apiResponse.totalNumberOfRecords);
      } else {
        console.error(`Failed to fetch records for ${dateString}`);
      }
    }

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: 'Total Number of Records',
          data: totalNumberOfRecords,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
        }
      ],
    });

    setLoading(false); // Set loading state to false after fetching data
  };

  useEffect(() => {
    handleGetRecord(); // Fetch data when component mounts
  }, []);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Number of Records'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <div>
          {/* <Line data={chartData} options={options} /> */}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
