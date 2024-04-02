export const calculateElementForPaging = (currentPage: number, pageSize: number, dataArray: any) => {
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize, dataArray?.length);

    // Get data for the current page
    return dataArray.slice(startIndex, endIndex);
}