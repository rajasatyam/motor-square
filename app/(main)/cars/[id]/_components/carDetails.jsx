'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@clerk/nextjs'

import { Calendar, Car, Currency, Fuel, Gauge, Heart, LocateFixed, MessageSquare, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import EmiCalculator from './emi-calculator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { format } from 'date-fns'

const CarDetails = ({car,testDriveInfo}) => {
    
    console.log(car,"dekhocar")
    console.log(testDriveInfo,"test.....")
    const router=useRouter()
    const {isSignedIn}=useAuth()
    const [isWishlisted,setIsWishlisted]=useState(car?.wishlisted)
    const [currentImageIndex,setCurrentImageIndex]=useState(0)
     const [isToggling,setIsToggling]=useState(false)

     const [showResult,setShowResult]=useState(null)

     console.log(isWishlisted,".......ok")
     const handleToggleSave=async(e)=>{
      
      if(!isSignedIn){
          toast.error("Please sign in to save cars")
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

    const handleBookTestDrive=()=>{
      if(!isSignedIn){
        toast.error("Please sign in to book a test drive")
        router.push("/sign-in")
        return
      }
      router.push(`/test-drive/${car?._id}`)
    }
    
  return (
    <div className='mt-20'>
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
  {car?(
    <>
  
    <div className='flex items-center justify-between'>
      <Badge className={`mb-2`}>{car?.bodyType}</Badge>
    </div>

    <h1 className='text-4xl font-bold mb-1'>
      {car?.year} {car?.make} {car?.model}
    </h1>

<div className='text-2xl font-bold text-[#e93db5]'>
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
</>
):(
    <div>
      {/* Badge Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 mb-2" />
      </div>

      {/* Title Skeleton */}
      <h1 className="mb-1">
        <Skeleton className="h-10 w-3/4" />
      </h1>

      {/* Price Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>

)}

<Dialog>
  <DialogTrigger className="w-full text-start">
  <Card className="pt-5">
    <CardContent >
    <div className='flex items-center gap-2 text-lg font-medium mb-2'>
      <Currency className='h-5 w-5 text-[#F58AD5]'/>
      <h3>EMI Calculator</h3>
    </div> 
    <div>
    | Estimated Monthly Payment:{" "}
    <span className='font-bold text-gray-900'>
    

    </span>{" "}
    for 60 months
    </div>
    <div className='text-xs text-gray-500 mt-1'>
     *Bases on $0 down payment and 4.5% interest rate
    </div>
    <div>

    </div>

  </CardContent>
  </Card>



  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>MotorSquare Car Loan Calculator</DialogTitle>
      <EmiCalculator price={car?.price}/>
    </DialogHeader>
  </DialogContent>
</Dialog>

<Card className="my-6 ">
  <CardContent>
    <div className='flex items-center gap-2 text-lg font-medium mb-2'>
      <MessageSquare className='h-5 w-5 text-[#F58AD5]'/>
      <h3>Have Questions?</h3>
    </div>
    <p className='text-sm text-gray-600 mb-3'>
      Our representative are available to answer all your queries
      about this vehicle.
    </p>
    <a href="mailto:help@motor-square.in">
      <Button variant="outline" className="w-full">
        Request Info
      </Button>
    </a>
  </CardContent>

</Card>

{(car?.status === "SOLD" || car?.status === "UNAVAILABLE") && (
  <Alert variant="destructive">
    <AlertTitle className="capitalize">
      This car is {car?.status.toLowerCase()}
    </AlertTitle>
    <AlertDescription>Please check again later.</AlertDescription>
  </Alert>
)}

{car?.status !=="SOLD" && car?.status !=="UNAVAILABLE" && (
<Button className="w-full py-6 text-lg bg-[#e93db5] border border-[#C2185B] hover:bg-[#e93db5] cursor-pointer" 
disabled={testDriveInfo?.userTestDrive && Object.keys(testDriveInfo?.userTestDrive).length > 0}
onClick={handleBookTestDrive}
>
  <Calendar className="mr-5 h-5 w-5" />
  {testDriveInfo?.userTestDrive?.length > 0  && testDriveInfo?.userTestDrive[0]?.bookingDate?`Booked for ${format(
   new Date(testDriveInfo?.userTestDrive[0]?.bookingDate),
   "EEEE,MMMM d,yyyy"
  ).toString()}`:"Book Test Drive"}
  </Button>
)}

  </div>

    </div>
    {/* details and feature section */}
    {car?(
    <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Description</h3>
            <p className="whitespace-pre-line text-gray-700">
              {car?.description}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6">Features</h3>
            <ul className="grid grid-cols-1 gap-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#E93DB5] rounded-full"></span>
                {car?.transmission} Transmission
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#E93DB5] rounded-full"></span>
                {car?.fuelType} Engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#E93DB5] rounded-full"></span>
                {car?.bodyType} Body Style
              </li>
              {car?.seats && (
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#E93DB5] rounded-full"></span>
                  {car.seats} Seats
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 bg-[#E93DB5] rounded-full"></span>
                {car?.color} Exterior
              </li>
            </ul>
          </div>
        </div>
      </div>
    ):(
       <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Description Section */}
        <div>
          <Skeleton className="h-8 w-32 mb-6" /> {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Features Section */}
        <div>
          <Skeleton className="h-8 w-32 mb-6" /> {/* Title */}
          <ul className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                <Skeleton className="h-4 w-40" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    )}


       {car?(
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Make</span>
              <span className="font-medium">{car?.make}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Model</span>
              <span className="font-medium">{car?.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Year</span>
              <span className="font-medium">{car?.year}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Body Type</span>
              <span className="font-medium">{car?.bodyType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Fuel Type</span>
              <span className="font-medium">{car?.fuelType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Transmission</span>
              <span className="font-medium">{car?.transmission}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Mileage</span>
              <span className="font-medium">
                {car?.mileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Color</span>
              <span className="font-medium">{car?.color}</span>
            </div>
            {car?.seats && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Seats</span>
                <span className="font-medium">{car?.seats} seats</span>
              </div>
            )}
          </div>
        </div>
      </div>
       ):(
         <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <Skeleton className="h-8 w-40 mb-6" /> {/* "Specifications" heading */}

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b items-center"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
       )}

       <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Dealership Location</h2>
         <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            {/* Dealership Name and Address */}
            <div className="flex items-start gap-3">
              <LocateFixed className="h-5 w-5 text-[#F58AD5] mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Motor Square</h4>
                <p className="text-gray-600">
                  {testDriveInfo?.dealership?.address || "Not Available"}
                </p>
                <p className="text-gray-600 mt-1">
                  Phone: {testDriveInfo?.dealership?.phone || "Not Available"}
                </p>
                <p className="text-gray-600">
                  Email: {testDriveInfo?.dealership?.email || "Not Available"}
                </p>
              </div>
            </div>
            {/* Working hours */}

            <div className='md:w-1/2 lg:w-1/3'>
              <h4 className='font-medium mb-2'>Working Hours</h4>
              <div>
                {testDriveInfo?.dealership?.workingHour ? testDriveInfo?.dealership?.workingHour.sort((a,b)=>{
                   const days = [
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY",
                        ];
                  return (
                    days?.indexOf(a.dayOfWeek.toUpperCase())-days?.indexOf(b.dayOfWeek.toUpperCase())  //yha sorting index wise hogi
                  )
                }).map((day)=>(
                    <div key={day.dayOfWeek} className='flex justify-between text-sm'>
                       <span>
                        {day.dayOfWeek.charAt(0)+day.dayOfWeek.slice(1).toLowerCase()}
                       </span>
                      <span>
                            {day?.isOpen
                              ? `${day.openTime} - ${day.closeTime}`
                              : "Closed"}
                          </span>

                    </div>
                  )): [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day, index) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span>
                          {index < 5
                            ? "9:00 - 18:00"
                            : index === 5
                            ? "10:00 - 16:00"
                            : "Closed"}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
       </div>
       </div>
       
       
       </div>




    </div>
  )
}

export default CarDetails