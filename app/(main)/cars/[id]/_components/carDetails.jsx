'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@clerk/nextjs'

import { Car, Currency, Fuel, Gauge, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CarDetails = ({car,testDriveInfo}) => {
    
    console.log(car,"dekhocar")
    const router=useRouter()
    const {isSignedIn}=useAuth()
    const [isWishlisted,setIsWishlisted]=useState(car?.wishlisted)
    const [currentImageIndex,setCurrentImageIndex]=useState(0)
     const [isToggling,setIsToggling]=useState(false)

     const [showResult,setShowResult]=useState(null)

     console.log(isWishlisted,".......ok")
     const handleToggleSave=async(e)=>{
      
      if(!isSignedIn){
          toast.error("Please sing in to save cars")
          router.push('/sign-in')
          return;
      }


    
        const response=await fetch(`/api/toggleSavedCars?carId=${car._id}`,{
            method:"POST"
        })

        const result=await response.json()
        console.log(result,"res dekho")
              if(isToggling)  return
        
        if(response.ok) {
         
            toast.success(result?.message)
          setIsWishlisted(result.saved);

       
 
        }
     
    }

    
useEffect(() => {
  if (typeof car?.wishlisted === 'boolean') {
    setIsWishlisted(car.wishlisted);
  }
}, [car?.wishlisted]);
    const handleShare=()=>{
       if(navigator.share){
        navigator.share({
          title:`${car.year} ${car.make} ${car.model}`,
          text:`Check out this ${car.year} ${car.make} ${car.model} on MotorSquare`,
          url:window.location.href
        })
        .catch((error)=>{
          console.log("Error sharing",error)
          copyToClipboard()
        })
       }else{
        copyToClipboard()
       }
    }

    const copyToClipboard=()=>{
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
    
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
       {car?.images && car?.images.length>1 &&(
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {car?.images.map((image,index)=>(
             
            <div key={index}
             className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${
              index===currentImageIndex ?"border-2 border-blue-600":"opacity-70 hover:opacity-100"
             }`}
             onClick={()=>setCurrentImageIndex(index)}
            >
<Image
  src={image?.url}
  alt={`${car.year} ${car.make} ${car.model} -view ${index + 1}`}
  fill
  className="object-cover"
/>

            </div>
          ))}


        </div>

       )} 
                 <div className='flex mt-4 gap-4'>
            <Button
             variant="outline"
             className={`flex items-center gap-2 flex-1 ${isWishlisted?"text-red-500":""}`}
             onClick={handleToggleSave}
            disabled={isToggling}
            >
             <Heart 
              className={`h-5 w-5 ${isWishlisted?"fill-red-500":""}`}
             />
            {isWishlisted==="true"?"Saved":"Save"}
            </Button>
            <Button
             variant="outline"
             className="flex items-center gap- flex-1"
             onClick={handleShare}
         
            >
            <Share2 className='h-5 w-5'/>
            Share
            </Button>

          </div>
  </div>
  <div className="w-full lg:w-5/12">
    <div className='flex items-center justify-between'>
      <Badge className={`mb-2`}>{car?.bodyType}</Badge>
    </div>

    <h1 className='text-4xl font-bold mb-1'>
      {car?.year} {car?.make} {car?.model}
    </h1>

<div className='text-2xl font-bold text-blue-600'>
  ${car?.price}
</div>

<div className='grid grid-cols-2 md:grid-cols-3 gap-4 my-6'>
 <div className='flex items-center gap-2'>
   <Gauge className='text-gray-500 h-5 w-5' />
   <span>{car?.mileage.toLocaleString()} miles</span>
 </div>
<div className='flex items-center gap-2'>
   <Fuel className='text-gray-500 h-5 w-5' />
   <span>{car?.fuelType}</span>
</div>
<div className='flex items-center gap-2'>
  <Car className='text-gray-500 h-5 w-5'/>
  <span>{car?.transmission}</span>
</div>
</div>

<Card>


  <CardContent>
    <div className='flex items-center gap-2 text-lg font-medium mb-2'>
      <Currency className='h-5 w-5 text-blue-600'/>
      <h3>EMI Calculator</h3>
    </div> 
    <div>
      
    </div>

  </CardContent>

</Card>
  </div>

    </div>
    </div>
  )
}

export default CarDetails