'use client'
import { useAuth } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ReservationList from './_components/reservations-list'
import { redirect } from 'next/navigation'


const ReservationPage = () => {
 const {isSignedIn}=useAuth()
//  if(!isSignedIn){
//     redirect("/sign-in?redirect=/reservations")
//  }

const [reservationData,setReservationData]=useState(null)
const [isrefetch,setIsRefetch]=useState(false)
    const getUserReservations=async()=>{
        try{

            const response=await fetch(`/api/getUserTestDrive`,{
                method:"GET"
            })

            const result=await response.json()
            setReservationData(result)
            console.log(result,"dekho result")
            if(response.ok){
                toast.success("Successfully fetched user test drive")
            }
        }catch(error){
             toast.error("Failed to fetch user test drive")
        }
}

useEffect(()=>{
   getUserReservations()
},[isrefetch])
  return (
    <div className='container  -my-2'>
        <img 
    src="/body/image-21.svg"
    className="absolute right-0 top-[40%] -translate-y-1/2 w-[40%] object-cover z-10"
    alt="Right image"
  />

<ReservationList reservationData={reservationData} setIsRefetch={setIsRefetch}/>

    </div>
  )
}

export default ReservationPage