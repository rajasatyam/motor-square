'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import {  CalendarIcon, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { undefined, z } from 'zod'
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


const testDriveSchema=z.object({
    date:z.date({
        required_error:"Please select a date for your test drive"
    }),
    timeSlot:z.string({
        required_error:"Please select a time slot"
    }),
    notes:z.string().optional()
})
const TestDriveForm = ({car,testDriveInfo}) => {
  
    console.log(testDriveInfo,"piyush bdcoe")

    const router=useRouter()
    const [availableTimeSlots,setAvailableTimeSlots]=useState([])
    const [showConfirmation,setShowConfirmation]=useState(false)
    const [bookingDetails,setBookingDetails]=useState(null)

    const {control,handleSubmit,watch,setValue,reset,formState:{errors,isValid},}=useForm({
        resolver:zodResolver(testDriveSchema),
        defaultValues:{
            date:undefined,
            timeSlot:"",
            notes:"",
        }
    })

    const dealership=testDriveInfo?.dealership
    const existingBooking=testDriveInfo?.userTestDrive || [];
    
    const selectedDate=watch("date")
   useEffect(()=>{
     console.log(selectedDate,"chanchal")
     console.log("Selected Date:", selectedDate, typeof selectedDate);

   },[selectedDate])

   const onSubmit=async(data)=>{

   }
const hasSelectedDate = selectedDate instanceof Date;




   const isDayDisabled=(day)=>{
      if(day < new Date()){
        return true
      }
      const dayOfWeek=format(day,'EEEE') //ye dega us din kya hai SUNDAY,MONDAY etc

      const daySchedule=dealership?.workingHour.find((schedule)=>   schedule.dayOfWeek === dayOfWeek)  //ye workingHour m s us din k object ko match krke pura object dega

      return !daySchedule || !daySchedule.isOpen;


   }  

useEffect(()=>{
    console.log(selectedDate,"select")
if(!selectedDate || !dealership?.workingHour) return
  const selectedDayOfWeek =selectedDate instanceof Date ? format(selectedDate, 'EEEE') : null;
const daySchedule=dealership?.workingHour.find((schedule)=>schedule.dayOfWeek===selectedDayOfWeek)
console.log(daySchedule,"pkkkkkkk")
if(!daySchedule || !daySchedule?.isOpen){
    setAvailableTimeSlots([])
    return
}

console.log(selectedDayOfWeek,"india")
const openHour=parseInt(daySchedule?.openTime.split(":")[0])
console.log(openHour,"open")
const closeHour=parseInt(daySchedule?.closeTime.split(":")[0])
console.log(closeHour,"close")
const slots=[]
for(let hour=openHour;hour<closeHour;hour++){
  const startTime=`${hour.toString().padStart(2,"0")}:00`;
  const endTime=`${(hour+1).toString().padStart(2,"0")}:00`
   console.log(startTime,"abhsisheo")
   console.log(endTime,"gill")
let isBooked=false
 if (existingBooking.length !== 0) {
    console.log("yha nhi aane chahiye")
   isBooked=existingBooking.some((booking)=>{
    const bookingDate=booking.date
    return (
        bookingDate===format(selectedDate,'yyyy-MM-dd') && 
        (booking.startTime === startTime || booking.endTime === endTime)
    )
  })
}



  if(!isBooked){
    slots.push({
        id:`${startTime}-${endTime}`,
        label:`${startTime}-${endTime}`,
        startTime,
        endTime
    })
  }

}
  setAvailableTimeSlots(slots)
  // clear time slots when date changes
setValue("timeSlot","")
},[selectedDate])

// useEffect(()=>{
//   console.log(availableTimeSlots,"hindu")
// },[availableTimeSlots])
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-1'>
            <Card>

  <CardContent className="p-">
 <h2 className='text-xl font-bold mb-4'>Car Details</h2>
 <div className='aspect-video rounded-lg overflow-hidden relative mb-4'>
    {
        car?.images && car?.images.length > 0 ?(
          <img 
          src={car.images[0]?.url}
          alt={`${car?.year} ${car?.make} ${car?.model}`}
          className='object-cover w-full h-full'
          />
        ):(
         <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
            <Car className='h-12 w-12 text-gray-400'/>
         </div>
        )
    }


 </div>
{car?(
<> <h3 className='text-lg font-bold'>
    {car?.year} {car?.make} {car?.model}
 </h3>


 <div className='mt-2 text-xl font-bold text-[#FF1493]'>
    ${car?.price.toLocaleString()}
 </div>

 <div className='mt-4 text-sm text-gray-500'>
  <div className='flex justify-between py-1 border-b'>
   <span>Mileage</span>
   <span className='font-medium'>
    {car?.mileage.toLocaleString()} miles
   </span>
  </div>
  <div className='flex justify-between py-1 border-b'>
    <span>Fuel Type</span>
    <span className='font-medium'>{car?.fuelType}</span>

  </div>
    <div className='flex justify-between py-1 border-b'>
    <span>Transmission</span>
    <span className='font-medium'>{car?.transmission}</span>

  </div>
      <div className='flex justify-between py-1 border-b'>
    <span>Body Type</span>
    <span className='font-medium'>{car?.bodyType}</span>

  </div>
        <div className='flex justify-between py-1 '>
    <span>Color</span>
    <span className='font-medium'>{car?.color}</span>

  </div>
 </div></>
):(
 <div>
      {/* Title */}
      <Skeleton className="h-6 w-2/3 mb-2" />

      {/* Price */}
      <Skeleton className="h-7 w-1/4 mb-4" />

      {/* Info fields */}
      <div className="mt-4 text-sm text-gray-500 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between py-1 border-b">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
)}

  </CardContent>

</Card>

<Card className='mt-6'>
  <CardContent className='p-6'>
    <h2 className='text-xl font-bold mb-4'>Dealership Info</h2>
   <div className='text-sm'>
     <p className='font-medium'>
        {dealership?.name || "Motor Square"}
     </p>
     <p className='text-gray-600 mt-1'>
       {dealership?.address || "Address not available"}
     </p>
     <p className='text-gray-600 mt-3'>
       <span className='font-medium'>Phone:</span>{' '}
       {dealership?.phone || "Not Available"}
     </p>
     <p className='text-gray-600'>
       <span className='font-medium'>Email":</span>{' '}
       {dealership?.email || "Not available"}
     </p>
   </div>
  </CardContent>

</Card>

        </div>
        <div className='md:col-span-2'>
            <Card>

  <CardContent>
  <h2 className='text-xl font-bold mb-6'>Schedule Your Test Drive</h2>
  <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

    <div className='space-y-2'>
    <label className='block text-sm font-medium'>
        Select a Date
    </label>
    
    {/* To get the control of the form we used it */}
    <Controller 
     name='date'
     control={control}
     render={({field})=>{
        return <div>
    <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className={cn(
        'w-full justify-start text-left font-normal',
        !field.value && 'text-muted-foreground'
      )}
    >
    <CalendarIcon className="mr-2 h-4 w-4" />
      {field.value instanceof Date?format(field.value,"PPP"):"Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent>

  <Calendar
    mode="single"
    selected={field.value}
    onSelect={field.onChange}
    initialFocus
    disabled={isDayDisabled}
  />

  </PopoverContent>
</Popover>
{errors?.date && (
    <p className='text-sm font-medium text-red-500 mt-1'>
      {errors.date.message}
    </p>
)}
        </div>
     }}
    
    
    />  
</div>
  </form>

  <div className='space-y-2'>
    <label className='block text-sm font-medium'>
        Select a Time Slot
    </label>
        <Controller 
     name='timeSlot'
     control={control}
     render={({field})=>{
        return <div>
<Select 
 
 value={field.value}
 onValueChange={field.onChange}
 disabled={
    !selectedDate || availableTimeSlots.length === 0
 }
>
  <SelectTrigger >
<SelectValue
  placeholder={
    !hasSelectedDate
      ? "Please select a date first"
      : availableTimeSlots.length === 0
      ? "No available slots on this date"
      : "Select a time slot"
  }
/>

  </SelectTrigger>
  <SelectContent>
    {availableTimeSlots?.map((slot)=>(
         <SelectItem key={slot.id} value={slot.id}>{slot.label}</SelectItem>
    ))}
   

  </SelectContent>
</Select>
{errors?.timeSlot && (
    <p className='text-sm font-medium text-red-500 mt-1'>
      {errors.timeSlot.message}
    </p>
)}
        </div>
     }}
    
    
    /> 
  </div>

  </CardContent>

</Card>
        </div>
    </div>
  )
}

export default TestDriveForm