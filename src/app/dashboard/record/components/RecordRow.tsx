import Link from 'next/link';
import React from 'react';

type RecordProps = {
  recordId: number;
  status: string;
  recordTime: string;
  userRatingPercent: number;
  predictedPercent: number;
  createdDate: string;
  token: string | undefined;
};

export default function RecordRow({
  recordId,
  status,
  recordTime,
  userRatingPercent,
  predictedPercent,
  createdDate,
  token,
}: RecordProps) {
  return (
    <tr className="bg-gray-100">
      <td className="border px-4 py-2">{status}</td>
      <td className="border px-4 py-2">{recordTime}</td>
      <td className="border px-4 py-2">{userRatingPercent}</td>
      <td className="border px-4 py-2">{predictedPercent}</td>
      <td className="border px-4 py-2">{createdDate}</td>
      <td className="border px-4 py-2">
        <Link href="/dashboard/record/[recordId]" as={`/dashboard/record/${recordId}`}>
          View Details
        </Link>
      </td>
    </tr>
  );
}