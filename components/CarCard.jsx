"use client"

import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { CarIcon, Heart, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { is } from 'date-fns/locale'
import { Badge } from './ui/badge'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'


const CarCard = ({car,setRefetchCar}) => {
      

    const [isSaved,setSaved]=useState(car.wishlisted)
    const [isToggling,setIsToggling]=useState(false)
    const [userFavourite,setUserFavourite]=useState(null)
 
    const router=useRouter()
    const {isSignedIn}=useAuth()
    console.log("dekho signed",isSignedIn)
    console.log(car.wishlisted,"car wish")
  
    const handleToggleSave=async(e)=>{
         setIsToggling(true)
      if(!isSignedIn){
          toast.error("Please sing in to save cars")
          router.push('/sign-in')
          return;
      }
      if(isToggling)  return

    
        const response=await fetch(`/api/toggleSavedCars?carId=${car._id}`,{
            method:"POST"
        })

        const result=await response.json()
          setUserFavourite(result)
        if(response.ok) {
            setIsToggling(false)
            toast.success(result?.message)
            result.saved===true?setSaved(true):setSaved(false)
       
  if (setRefetchCar) {
    setRefetchCar(prev => !prev); 
  }
        }
     
    }
    
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group py-0">
        <div className='relative h-48'>{car.images && car.images.length>0 ?(
<div className='relative w-full h-full '>
<Image src={car.images[0].url} alt={`${car.make} ${car.model}`}
fill className='object-cover group-hover:scale-105 transition duration-300'/>
</div>
        ):(
            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
<CarIcon className='h-12 w-12 text-gray-400'/>
            </div>
        ) }

{isSignedIn && (
        <Button varient="ghost" size="icon" className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${isSaved?"text-red-500 hover:text-red-600 ":"text-gray-600 "}`
    
    } onClick={handleToggleSave}>
        {isToggling?(
            <Loader2 className="h-4 w-4 animate-spin"/>
        ):(
              <Heart className={isSaved?"fill-current   ":"stroke-gray-500 hover:stroke-red-500 "} size={20}/>
        )}
           
        </Button>
)}

        </div>

        <CardContent className="p-4">
            <div className='flex flex-col mb-2'>
                <h3 className='text-lg font-bold line-clamp-1'>
                    {car.make} {car.model}
                </h3>
                <span className='text-xl font-bold text-[#FF1493]'>${car.price.toLocaleString()}</span>
            </div>

            <div className='text-gray-600 mb-2 flex items-center'>
                <span>{car.year}</span>
                <span className='mx-2'>•</span>
                <span>{car.transmission}</span>
                <span className='mx-2'>•</span>
                <span>{car.fuelType}</span>

            </div>

            <div className='flex flex-wrap gap-1 mb-4'>
             <Badge variant="outline" className="bg-gray-50">
                {car.bodyType}
             </Badge>
             <Badge variant="outline" className="bg-gray-50">
                {car.mileage.toLocaleString()} miles
             </Badge>
             <Badge variant="outline" className="bg-gray-50">
                {car.color}
             </Badge>

            </div>

            <div className='flex justify-between'>
                <Button className="flex-1 cursor-pointer bg-[#E93DB5] border border-[#C2185B] hover:bg-[#E93DB5]" onClick={()=>{router.push(`/cars/${car._id}`)}}>View Car</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default CarCard
