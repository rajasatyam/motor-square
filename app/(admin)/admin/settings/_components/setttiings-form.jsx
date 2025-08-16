'use client'

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@clerk/nextjs'
import { Clock, Shield } from 'lucide-react'
import React, { useEffect, useState } from 'react'




  const DAYS=[
        {value:"MONDAY",label:"Monday"},
        {value:"TUESDAY",label:"Tuesday"},
        {value:"WEDNESDAY",label:"Wednesday"},
        {value:"THURSDAY",label:"Thursday"},
        {value:"FRIDAY",label:"Friday"},
        {value:"SATURDAY",label:"Saturday"},
        {value:"SUNDAY",label:"Sunday"},
    ]

const SettingForm = () => {

const [workingHours,setWorkingHours]=useState(
    DAYS.map((day)=>({
     
        dayOfWeek:day.value,
       openTime:"09:00",
       closeTime:"18:00",
       isOpen:day.value !== "SUNDAY"
    }))
)
  
const [userSearch,setUserSearch]=useState("")



 const { getToken } = useAuth();

 
  const fetchUsers=async()=>{
    try{
        const token = await getToken()
    console.log(token);
    const response=await fetch('http://localhost:3000/api/getUserById',{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
    const result=await response.json();
    console.log(response)
}catch(error){
     console.error("Error fetching users:", error)
}
  }



// useEffect(()=>{
//     fetchUsers()
// },[])


const handleWorkingHourChange=()=>{
    
}
  return (
    <div className='space-y-6'>
      <Tabs defaultValue="hours" className="">
  <TabsList>
    <TabsTrigger value="hours">
        <Clock className='h-4 w-4 mr-2'  />
        Working Hours 
    </TabsTrigger>
    <TabsTrigger value="admins">
       <Shield className='h-4 w-4 mr-2' />
         Admin Users
    </TabsTrigger>
  </TabsList>
  <TabsContent value="hours">
   <Card>
  <CardHeader>
    <CardTitle>Working Hours</CardTitle>
    <CardDescription>
        Set your dealership's working hours for each day of the week.
        </CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <div className='space-y-4'>
      {DAYS.map((day,index)=>{
        return (
            <div key={day.value} className='grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50'>
              <div  className='col-span-3 md:col-span-2'>
                 <div className='font-medium'>{day.label}</div>

              </div>

              <div className='col-span-9 md:col-span-2 flex items-center '>
               <Checkbox
                id={`is-open-${day.value}`}
                checked={workingHours[index]?.isOpen}
                onCheckedChange={
                    (checked)=>{
                      handleWorkingHourChange(index,"isOpen",checked)
                    }
                }
                
               />
               <Label htmlFor={`is-open-${day.value}`}>
                {workingHours[index]?.isOpen?"Open":"Closed"}
               </Label>



              </div>


            </div>
        )
      })}

    </div>
  </CardContent>

</Card>

  </TabsContent>
  <TabsContent value="admins">Change your password here.</TabsContent>
</Tabs>
    </div>
  )
}

export default SettingForm
