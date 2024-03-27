'use client';
import React, { useState, useEffect } from 'react';
import { getRecords } from '@/app/lib';
import { IRecords } from '@/app/types';

type RecordRowProps = {
    token: string | undefined;
};

const RecordRow: React.FC<RecordRowProps> = ({ token }) => {
    const [records, setRecords] = useState<IRecords | null>(null);

    console.log(records);

    useEffect(() => {
        if (token) {
            const fetchRecords = async () => {
                try {
                    const fetchedRecords = await getRecords(token);
                    console.log(fetchedRecords);
                    setRecords(fetchedRecords);
                } catch (error) {
                    console.error('Failed to fetch records:', error);
                }
            };

            fetchRecords();
        }
    }, [token]);

    return (
        <div className="container mx-auto">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Record Time</th>
                        <th className="px-4 py-2">User Rating Percent</th>
                        <th className="px-4 py-2">Predicted Percent</th>
                        <th className="px-4 py-2">Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {records.map((record) => (
                        <tr key={record.id} className="bg-gray-100">
                            <td className="border px-4 py-2">{record.status}</td>
                            <td className="border px-4 py-2">{record.recordTime}</td>
                            <td className="border px-4 py-2">{record.userRatingPercent}</td>
                            <td className="border px-4 py-2">{record.predictedPercent}</td>
                            <td className="border px-4 py-2">{record.createdDate}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </div>
    );
};

export default RecordRow;
