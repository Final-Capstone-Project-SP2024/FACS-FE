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

function addSpacesToCamelCase(text: string) {
  return text.replace(/([A-Z])/g, ' $1').trim();
}

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
    <div className='bg-gray-100 p-4'>
      {filterUI}
      <div className="overflow-x-auto p-3 bg-white">
        <table className="table-auto w-full  border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr className="w-full border-gray-300 border-b py-8">
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Status</th>
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Record Time</th>
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">User Rating</th>
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Predicted(%)</th>
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Record Type</th>
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Ratings</th>
              {/* <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Most Votings</th> */}
              <th className="border-b-2 border-gray-200 px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{record.status}</td>
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
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
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{record.userRatingPercent}</td>
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">{record.predictedPercent}</td>
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                  <p className={`whitespace-no-wrap inline-block px-2 py-1 rounded 
                      ${record.recordType.recordTypeName === 'Detection' ? 'border border-green-500 text-green-500 bg-green-100 font-bold' :
                      record.recordType.recordTypeName === 'ElectricalIncident' ? 'border border-yellow-800 text-yellow-800 bg-yellow-200 font-bold' :
                        record.recordType.recordTypeName === 'AlarmByUser' ? 'border border-red-500 text-red-500 bg-red-100 font-bold' :
                          'border border-gray-300 text-gray-900 bg-gray-100'
                    }`}>
                    {addSpacesToCamelCase(record.recordType.recordTypeName)}
                  </p>
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                  {record.userRatings.length > 0 ? Math.max(...record.userRatings.map(rating => rating.rating)) : null}
                </td>
                {/* <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
                {record.userVotings.length > 0 ? 'Level ' + Math.max(...record.userVotings.map(voting => voting.voteLevel)) : null}
              </td> */}
                <td className="border-b-2 border-gray-200 px-4 py-2 text-left">
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
      </div>
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
    </div>
  );
};

export default RecordRow;
