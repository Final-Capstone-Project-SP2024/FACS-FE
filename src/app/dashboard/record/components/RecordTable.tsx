'use client'
import Pagination from '@/app/components/Pagingnation'
import { DEFAULT_ITEM } from '@/app/util/Constant';
import { calculateElementForPaging } from '@/app/util/utilities';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


type Props = {
  body: any,
  token: any,
};

const RecordTable = ({ body, token }: Props) => {
  console.log(body);

  const [data, setData] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(DEFAULT_ITEM);
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const page = searchParams.get('page');
    if (!page) {
      router.push(pathname + '?' + createQueryString('page', '1'))
    }

    setData(calculateElementForPaging(parseInt(page!), DEFAULT_ITEM, body?.results));
    setTotalPages(Math.ceil(body?.results.length / DEFAULT_ITEM))
  }, [searchParams])

  const createQueryString =
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    }


  const handlePrevPage = (prevPage: number) => {
    const page = searchParams.get('page')!;
    const nextpage = parseInt(page) - 1;
    router.push(pathname + '?' + createQueryString('page', nextpage.toString()))
  };

  const handleNextPage = (nextPage: number) => {
    const page = searchParams.get('page')!;
    const nextpage = parseInt(page) + 1;
    router.push(pathname + '?' + createQueryString('page', nextpage.toString()))
  };

  return (
    <div>
      <table className="table-auto w-full mb-5">
        <thead>
          <tr>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Record Time</th>
            <th className="px-4 py-2">User Rating Percent</th>
            <th className="px-4 py-2">Predicted Percent</th>
            <th className="px-4 py-2">Created Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((record, index) => (
            <tr className="bg-gray-100" key={index}>
              <td className="border px-4 py-2">{record?.status}</td>
              <td className="border px-4 py-2">{record?.recordTime}</td>
              <td className="border px-4 py-2">{record?.userRatingPercent}</td>
              <td className="border px-4 py-2">{record?.predictedPercent}</td>
              <td className="border px-4 py-2">{record?.createdDate}</td>
              <td className="border px-4 py-2">
                <Link href="/dashboard/record/[recordId]" as={`/dashboard/record/${record?.recordId}`}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-end'>
        <Pagination
          totalPages={totalPages}
          currentPage={parseInt(searchParams?.get('page')!) || 1}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
        />
      </div>
    </div>
  )
}

export default RecordTable
