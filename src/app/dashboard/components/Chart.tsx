import React from 'react'

const handleGetRecord = async () => {
  const res = await fetch('https://firealarmcamerasolution.azurewebsites.net/api/v1/Record?Page=1&PageSize=10&Status=InFinish&FromDate=2024-04-7&ToDate=2024-04-7')
  if (res.ok) {
    const apiResponse = await res.json()
    console.log('Records fetched successfully')
    console.log(apiResponse)
  } else {
    console.error('Failed to fetch records')
  }
}

export default function Chart({token}: {token: string | undefined}) {
  return (
    <div>
      this is chart
    </div>
  )
}
