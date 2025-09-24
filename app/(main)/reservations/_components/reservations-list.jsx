'use client'

import TestDriveCard from '@/components/test-drive-card'
import { Button } from '@/components/ui/button'

import { Calendar } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ReservationList = ({reservationData}) => {

    const [cancelling,setCancelling]=useState(false)
    const cancelUserTestDrive=async(id)=>{
        try {
            setCancelling(true)
          const response=await fetch(`/api/deleteUserTestDrive?bookingId=${id}`,{
            method:"POST"
          })
          const result=await response.json()
           if(response.ok){
              toast.success("Successfully cancelled test drive booking")
              setCancelling(false)
           }
        }catch(error){
          toast.error("Test drive is not cancelled")
        }
}

console.log(reservationData,"initial")
    const upcomingBooking=reservationData?.data?.filter((booking)=>['PENDING','CONFIRMED'].includes(booking.status))
       console.log(upcomingBooking,"upcoming")
    const pastBooking=reservationData?.data?.filter((booking)=>
    ['COMPLETED','CANCELLED','NO_SHOW'].includes(booking.status))
console.log(pastBooking,"past")
    if(reservationData?.data?.length===0){
        return(
            <div className='min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50'>
              <div className='bg-gray-100 p-4 rounded-full mb-4'>
                <Calendar className='h-8 w-8 text-gray-500'/>
              </div>
              <h3 className='text-lg font-medium mb-2'>No Reservations Found</h3>
              <p className='text-gray-500 mb-6 max-w-wd'>
                You don't have any test drive reservations yet.Browse our cars and 
                book a test drive to get started. 
              </p>
              <Button variant="default" asChild>
                <Link href="/cars">Browse Cars</Link>
              </Button>
            </div>
        )
    }
  return (
    <div className='space-y-6'>
        <div>
            <h2 className='text-2xl font-bold mb-4'>Upcoming Test Drives</h2>
            {upcomingBooking?.length === 0?(
              <p className='text-gray-500 italic'>No upcoming test drives.</p>
            ):(
              <div className='space-y-3'>
                {upcomingBooking?.map((booking)=>(
                    <TestDriveCard 
                       key={booking._id}
                       booking={booking}
                 onCancel={() => cancelUserTestDrive(booking._id)}

                       isCancelling={cancelling}
                       showActions
                    />
                ))}
              </div>
             
            )}
        </div>
         
         {pastBooking?.length>0 ? (
            <div>
                <h2 className='text-2xl font-bold mb-4'>Past Test Drives</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {pastBooking?.map((booking)=>(
                        <TestDriveCard 
                          key={booking._id}
                          booking={booking}
                        showActions={false}
                        
                        />
                    ))}
                </div>
            </div>
         ):(
          <></>
         )}

    </div>
  )
}

export default ReservationList