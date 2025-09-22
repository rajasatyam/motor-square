'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import {  CalendarIcon, Car, CheckCircle2, Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { undefined, z } from 'zod'
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'



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
  const params=useParams()
  console.log("deklho params",params)

    const {id}= params
    

    const router=useRouter()
    


    console.log(id,"id...............")
    const [availableTimeSlots,setAvailableTimeSlots]=useState([])
    const [showConfirmation,setShowConfirmation]=useState(false)
    const [bookingDetails,setBookingDetails]=useState(null)
  const [bookingInProgress,setBookingInProgress]=useState(false)

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
    console.log(dealership,"dealership vaibhav")
    const selectedDate=watch("date")
   useEffect(()=>{
     console.log(selectedDate,"chanchal")
     console.log("Selected Date:", selectedDate, typeof selectedDate);

   },[selectedDate])

   const onSubmit=async(data)=>{
       console.log(data,"jo gya data")
    const selectedSlot=availableTimeSlots.find((slot)=>slot.id===data.timeSlot)
     console.log(selectedSlot,"...selefjfvgrdtfhgvdrtv")
      
     if(!selectedSlot){
      toast.error("Selected time slot not available")
     }
    setBookingInProgress(true)
      try{
        const response=await fetch(`/api/bookTestDrive?carId=${id}`,{
          method:"POST",
        headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
        },
      )
      console.log("dekh response",response)
      const result=await response.json()
      console.log(result,"resultjjds")
      if(response?.ok || response?.status===200 ){
        setBookingInProgress(false)
        toast.success("Successfully booked test drive")
                  setBookingDetails({
date: format(new Date(result?.data?.bookingDate), "EEEE, MMMM d, yyyy"),

timeSlot: `${format(
  parseISO(`2022-01-01T${result?.data?.startTime}`),
  "h:mm a"
)} - ${format(
  parseISO(`2022-01-01T${result?.data?.endTime}`),
  "h:mm a"
)}`,
notes:data?.notes

          })
          setShowConfirmation(true)
       
      }

      }catch(error){
        console.log(error,"errroro")
        setBookingInProgress(false)
        toast.error("Failed to book test drive.Please try again later")
        reset()
      }
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

useEffect(()=>{
  console.log(availableTimeSlots,"hindu")
},[availableTimeSlots])

const handleCloseConfirmation=()=>{
  setShowConfirmation(false)
  router.push(`/cars/${car?._id}`)
}
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

  <div className='space-y-2'>
    <label className='block text-sm font-medium'>
      Additional Notes(optional)
    </label>
    <Controller 
     name="notes"
     control={control}
     render={({field})=>{
      return <div>
      <Textarea
       {...field}
       placeholder="Any specific questions or requests for your test drive?"
       className="min-h-24"
      />
      </div>
     }}

    />
  </div>
<Button
type="submit"
disabled={bookingInProgress}
className="w-full bg-[#e93db5] text-white hover:bg-[#e93db5] hover:text-white"
>
  {
    bookingInProgress?(
<>
 <Loader2 className='mr-2 h-4 w-4 animate spin' />
 Booking Your Test Drive...
</>
    ):(
     "Book Test Drive"
    )
  }
</Button>
</form>
             <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">What to expect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Bring your driver's license for verification
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  Test drives typically last 30-60 minutes
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  A dealership representative will accompany you
                </li>
              </ul>
            </div>
  </CardContent>

</Card>
        </div>
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>

  <DialogContent>
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CheckCircle2 className='h-5 w-5 text-green-500'/>
        Test Drive Booked Successfully
      </DialogTitle>
      <DialogDescription>
           Your Test drive has been confirmed with the following details:
      </DialogDescription>
    </DialogHeader>
      {bookingDetails && (
        <div className='py-4'>
          <div className='space-y-3'>
            <div className='flex justify-between'>
               <span className='font-medium'>Car:</span>
               <span>
                {car?.year} {car?.make} {car?.model}
               </span>
            </div>
            <div className='flex justify-between'> 
              <span className='font-medium'>Date:</span>
              <span>{bookingDetails?.date}</span>
            </div>
                        <div className='flex justify-between'> 
              <span className='font-medium'>Time Slot:</span>
              <span>{bookingDetails?.timeSlot}</span>
            </div>
              <div className='flex justify-between'> 
              <span className='font-medium'>Dealership:</span>
              <span>{dealership?.name || "Motor Square"}</span>
            </div>
          </div>
          <div className='mt-4 p-3 rounded text-sm text-center bg-[#e93db5] text-white'>
            Please arrive 10 minutes early with your driving license.
          </div>
        </div>
      )}
      <div className='flex justify-end '>
        <Button className="bg-[#e93db5] text-white" onClick={handleCloseConfirmation}>Done</Button>
      </div>

  </DialogContent>
</Dialog>
    </div>
  )
}

export default TestDriveForm