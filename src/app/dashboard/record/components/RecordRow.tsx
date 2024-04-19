'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type RecordProps = {
  id: number;
  status: string;
  recordTime: string;
  userRatingPercent: number;
  predictedPercent: number;
  createdDate: string;
  userRatings: {
    userId: string;
    rating: number;
  }[];
  userVotings: {
    userId: string;
    voteLevel: number;
    voteType: {
      actionName: string;
    };
  }[];
  recordType: {
    recordTypeId: number;
    recordTypeName: string;
  };
  notificationLogs: {
    count: number;
    notificationType: {
      notificationTypeId: number;
      name: string;
    };
  }[];
  token: string | undefined;
};

const handleGetRecords = async (
  token: string | undefined,
  page: number,
  filters: { status?: string; fromDate?: string; toDate?: string }
) => {
  var url = `https://firealarmcamerasolution.azurewebsites.net/api/v1/Record?Page=${page}&PageSize=10`;

  if (filters.status) {
    url += `&Status=${encodeURIComponent(filters.status)}`;
  }
  if (filters.fromDate) {
    url += `&FromDate=${encodeURIComponent(filters.fromDate)}`;
  }
  if (filters.toDate) {
    url += `&ToDate=${encodeURIComponent(filters.toDate)}`;
  }
  console.log(`URL: ${url}`); // Debug line
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
      return {
        records: apiResponse.results,
        totalPages: apiResponse.totalNumberOfPages,
      };
    } else {
      console.error('Failed to fetch records');
      return { records: [], totalPages: 0 };
    }
  } catch (error) {
    console.error('Error fetching records:', error);
    return { records: [], totalPages: 0 };
  }
};

const RecordRow = ({ token }: { token: string | undefined }) => {
  const [records, setRecords] = useState<RecordProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<{ status?: string; fromDate?: string; toDate?: string }>({});

  useEffect(() => {
    const fetchRecords = async () => {
      const { records: fetchedRecords, totalPages: newTotalPages } = await handleGetRecords(token, currentPage, filters);
      setRecords(fetchedRecords);
      setTotalPages(newTotalPages);
    };

    fetchRecords();
  }, [token, currentPage, filters]);

  const filterUI = (
    <div className="flex space-x-4 my-4">
      <input
        type="date"
        placeholder="From Date"
        value={filters.fromDate}
        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      <input
        type="date"
        placeholder="To Date"
        value={filters.toDate}
        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        className="px-2 py-1 border border-gray-300 rounded"
      />
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="px-2 py-1 border border-gray-300 rounded"
      >
        <option value="">Select Status</option>
        <option value="InAction">In Action</option>
        <option value="InAlarm">In Alarm</option>
        <option value="InFinish">In Finish</option>
        <option value="InVote">In Vote</option>
      </select>
    </div>
  );

  return (
    <>
      {filterUI}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Record Time</th>
            <th className="px-4 py-2 border">User Rating(%)</th>
            <th className="px-4 py-2 border">Predicted(%)</th>
            <th className="px-4 py-2 border">Record Type Name</th>
            <th className="px-4 py-2 border">Ratings</th>
            <th className="px-4 py-2 border">Most Votings</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-2 border text-center">{record.status}</td>
              <td className="px-4 py-2 border text-center">
                {new Date(record.recordTime).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </td>
              <td className="px-4 py-2 border text-center">{record.userRatingPercent}</td>
              <td className="px-4 py-2 border text-center">{record.predictedPercent}</td>
              <td className="px-4 py-2 border text-center">{record.recordType.recordTypeName}</td>
              <td className="px-4 py-2 border text-center">
                {record.userRatings.length > 0 ? Math.max(...record.userRatings.map(rating => rating.rating)) : null}
              </td>
              <td className="px-4 py-2 border text-center">
                {record.userVotings.length > 0 ? 'Level ' + Math.max(...record.userVotings.map(voting => voting.voteLevel)) : null}
              </td>
              <td className="px-4 py-2 border text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded"
                >
                  <Link href={`/dashboard/record/${record.id}`}>
                    View Details
                  </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center my-2 space-x-4">
        <button
          onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prevPage) => Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default RecordRow;
