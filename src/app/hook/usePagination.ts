const dotts = "...";
const getPages = (length: number, inc: number = 1) => Array.from({ length }, (_, i) => i + inc);

export default function usePagination(totalItem: number, currentPage: number, itemsPerPage: number) {
  const totalPage = Math.ceil(totalItem / itemsPerPage);

  if (totalPage <= 5) {
    return getPages(totalPage);
  }
  // -> 1 2 3 4 ... 10
  if (currentPage <= 3) {
    return [1, 2, 3, 4, dotts, totalPage];
  }
  // -> 1 ... 4 5 6 ... 10
  if (currentPage < totalPage - 2) {
    return [1, dotts, currentPage - 1, currentPage, currentPage + 1, dotts, totalPage];
  }
  // -> 1 ... 7 8 9 10
  return [1, dotts, ...getPages(4, totalPage - 3)];
}
