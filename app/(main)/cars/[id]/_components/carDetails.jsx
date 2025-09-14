'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@clerk/nextjs'
import { Car } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const CarDetails = ({car,testDriveInfo}) => {
    
    console.log(car,"dekhocar")
    const router=useRouter()
    const {isSignedIn}=useAuth()
    const [isWishlisted,setIsWishlisted]=useState(car?.wishlisted)
    const [currentImageIndex,setCurrentImageIndex]=useState(0)
     const [isToggling,setIsToggling]=useState(false)

     const [showResult,setShowResult]=useState(null)
    //  const handleToggleSave=async(e)=>{
      
    //   if(!isSignedIn){
    //       toast.error("Please sing in to save cars")
    //       router.push('/sign-in')
    //       return;
    //   }


    
    //     const response=await fetch(`/api/toggleSavedCars?carId=${car._id}`,{
    //         method:"POST"
    //     })

    //     const result=await response.json()
    //           if(isToggling)  return
        
    //     if(response.ok) {
         
    //         toast.success(result?.message)
   
       
 
    //     }
     
    // }
    
  return (
    <div>
    <div className='flex flex-col lg:flex-row gap-8'>
        <div className='w-full lg:w-7/12'>
         <div className='aspect-video rounded-lg overflow-hidden relative mb-4'>
            {car?.images && car?.images?.length>0?(
                <Image 
                src={car?.images[currentImageIndex]?.url}
                alt={`${car.year} ${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
                />
            ):(
                   <Skeleton className="w-full h-full flex items-center justify-center">
          <Car className="h-24 w-24 text-gray-400" />
        </Skeleton>
            )}
         </div>

         <div></div>      

  </div>
        
    </div>
    </div>
  )
}

export default CarDetails