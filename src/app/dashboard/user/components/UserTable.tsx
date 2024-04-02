'use client'
import Pagination from '@/app/components/Pagingnation';
import { DEFAULT_ITEM } from '@/app/util/Constant';
import { calculateElementForPaging } from '@/app/util/utilities';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UpdateUser } from '.';

type Props = {
    body: any,
    token: any,
};

const UserTable = ({ body, token }: Props) => {
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
        setData(calculateElementForPaging(parseInt(page!), DEFAULT_ITEM, body));
        setTotalPages(Math.ceil(body?.length / DEFAULT_ITEM))
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
            <table className='border-separate w-full mb-5'>
                <thead>
                    <tr>

                        <th className="border px-4 py-2">Security Code</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Phone</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Update</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user?.securityCode}</td>
                            <td className="border px-4 py-2">{user?.email}</td>
                            <td className="border px-4 py-2">{user?.name}</td>
                            <td className="border px-4 py-2">{user?.phone}</td>
                            <td className="border px-4 py-2">{user?.role.roleName}</td>
                            <td className="border px-4 py-2">{user?.status}</td>
                            <td className="border px-4 py-2">
                                <UpdateUser userId={user.id} token={token} />
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

export default UserTable