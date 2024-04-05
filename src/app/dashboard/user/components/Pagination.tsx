import { usePagination } from '@/app/hook';
import Link from 'next/link';
import React from 'react'

export type PaginationProps = {
    totalItem: number;
    currentPage: number;
    renderPageLink: (page: number) => string;
    itemsPerPage?: number;
};

export default function Pagination({ totalItem, currentPage, itemsPerPage = 5, renderPageLink }: PaginationProps) {
    const totalPage = usePagination(totalItem, currentPage, itemsPerPage);
    return (
        <div>
            {totalPage.map((pageNumber, i) =>
                pageNumber === "..." ? (
                    <span key={i + 999}>{pageNumber}</span>
                ) : (
                    <Link key={i + 777} href={renderPageLink(pageNumber as number)}>
                        {pageNumber}
                    </Link>
                )
            )}
        </div>
    )
}
