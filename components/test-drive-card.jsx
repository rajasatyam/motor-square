import { Badge } from 'lucide-react'
import React from 'react'

const getStatusBadge=(status)=>{
    switch(status){
        case "PENDING":
            return <Badge className='bg-amber-100 text-amber-800'>Pending</Badge>
        case "CONIRMED":
            return <Badge className='bg-green-100 text-green-800'>Confirmed</Badge>
        case "COMPLETED":
            return <Badge className='bg-blue-100 text-blue-800'>Completed</Badge>
        case "CANCELLED":
            return <Badge className='bg-gray-100 text-gray-800'>Cancelled</Badge>
        case "NO_SHOW":
            return <Badge variant="outline">{status}</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

const TestDriveCard = ({
    booking,
    onCancel,
    showActions=true,
    isPast=false,
    isAdmin=false,
    isCancelling=false,
    renderStatusSelector=()=>null
}) => {
  return (
    <div>TestDriveCard</div>
  )
}

export default TestDriveCard