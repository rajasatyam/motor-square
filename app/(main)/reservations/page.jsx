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
},[])
  return (
    <div className='container  -my-2'>
        <img 
    src="/body/image-21.svg"
    className="absolute right-0 top-[40%] -translate-y-1/2 w-[40%] object-cover z-10"
    alt="Right image"
  />
       <section className="relative bg-gradient-to-b from-[#F58AD580] to-[#3EBEF780] h-[40vh] -z-10 w-full">



  {/* <div className="max-w-xl  text-center -mt-8 ml-60">
    <div className="mb-8">

      <h1 className="text-5xl md:text-[3rem] mb-4 text-[#00B0FF] jockey-one-regular flex flex-col gap-y-2"><div className="text-white ">FIND YOUR DREAM CAR</div>WITH MOTOR SQUARE</h1>
  
    </div>
 



  </div> */}
 </section>
<ReservationList reservationData={reservationData}/>

    </div>
  )
}

export default ReservationPage