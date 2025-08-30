'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@clerk/nextjs'
import { Clock, Loader2, Search, Shield, Users, UserX } from 'lucide-react'
import React, { useEffect, useReducer, useState } from 'react'
import { toast } from 'sonner'




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
     
        dayOfWeek:day.label,
       openTime:"09:00",
       closeTime:"20:00",
       isOpen:day.label !== "Sunday"
    }))
)
  
const [userSearch,setUserSearch]=useState("")
const [user,setUser]=useState()
const [fetchingUser,setIsFetchingUser]=useState(true)
const [fetchResults,setFetchResult]=useState([])          
const [isUpdatingRole,setIsUpdatingRole]=useState(false)
const [updateDialogOpen,setUpdateDialogOpen]=useState(false)
const [currentUser,setCurrentUser]=useState(null)
 const { getToken } = useAuth();

 
  const fetchUsers=async()=>{
    try{
        const token = await getToken()
    console.log(token);
    const response=await fetch('/api/getUserById',{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
    const result=await response.json();
    console.log(result,"user dekho")
    
      
    setUser(result?.data)
    setIsFetchingUser(false)
    



}catch(error){
     console.error("Error fetching users:", error)
}
  }

  useEffect(() => {
  console.log(user, "updated user state")
  console.log(user,"dekho pk ")
  console.log(fetchingUser,"user fectch state")
}, [user])


  const getUser=async()=>{
      try{
             const response=await fetch(`/api/getUserByName?search=${userSearch}`)
      const result=await response.json()
      console.log(result,"result vaibhav")
      setIsFetchingUser(true)
     setUser(result?.user)
      setFetchResult(result)
      if(response.ok){
        setIsFetchingUser(false)
        console.log(user,"yash")
      }
      }catch(error){
        toast.error("error fetching user",error)
      }


  }

  useEffect(()=>{
    if(userSearch !== ""){
       const handler = setTimeout(() => {
    getUser(userSearch);
  }, 5000);

  
  return () => {
    clearTimeout(handler);
  };
}
  },[userSearch])



  const getDealershipInfo=async()=>{
    try{
        const token = await getToken()
           const response=await fetch('/api/getDealershipInfo',{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    const result=await response.json()
    console.log(result,"res")
       const array=[]
if(result?.data?.workingHour && result?.data?.workingHour?.length>0){
  DAYS.forEach((day)=>
  {
    const finalRes=result?.data?.workingHour?.find((hour)=>hour.dayOfWeek===day.label)
 
 if(finalRes){
 array.push(finalRes)
 }
   
     
  })

  if(array.length>0){

  setWorkingHours(array)
  }
  


}


    }catch(error){
     console.error("Error fetching users:", error)
}
 
  }


useEffect(()=>{
    getDealershipInfo() 
    if(userSearch===""){
fetchUsers()
    }
    
},[])


const handleMakeAdmin=async(user)=>{
    try{
 const id=user?._id


  const role="ADMIN"
  
 const response=await fetch(`/api/updateUserRole?role=${role}&id=${id}`,{
  method:'PUT'
 })
 const result=await response.json()
 console.log(result,"cskkkkkk thala")
 if(response.ok){
  toast.success(`${user.name} successfully updated to admin`)
  setUser(result?.data)
  setUpdateDialogOpen(false)
  setIsUpdatingRole(false)
 }
    }catch(error){
      toast.error("Error Updating User To Admin"+error.message)
    }
  
}

const handleRemoveAdmin=async(user)=>{
 try{
 const id=user?._id


  const role="USER"
  
 const response=await fetch(`/api/updateUserRole?role=${role}&id=${id}`,{
    method:'PUT'
 })
 const result=await response.json()
 console.log(result,"mirohit")
 if(response.ok){
  toast.success(`${user.name} successfully removed from admin`)
  setUser(result?.data)

  setUpdateDialogOpen(false)
  setIsUpdatingRole(false)
 }
    }catch(error){
      toast.error("Error Removing  User From Admin"+error.message)
    }

}


const handleWorkingHourChange=(index,field,value)=>{
        
       const updatedHours=[...workingHours]
 
          

       updatedHours[index]={
        ...updatedHours[index],
        [field]:value
       }
      
           console.log(updatedHours,"updated ")
       setWorkingHours(updatedHours)

}




const handleSaveHours=async()=>{
    try{
        console.log(workingHours,"......")
   const response=await fetch(`/api/saveWorkingHours`,{
    method:'POST',
    headers: {
    "Content-Type": "application/json",  
  },
  body: JSON.stringify(workingHours),
   })

   const result = await response.json()
   console.log(result)
   if(result){
    toast.success("Working Hour Saved Successfully")

    setTimeout(()=>{
      window.location.reload()
    },3000)
   }
    }catch(error){
       toast.error("error saving working hour"+error.message)
    }
    
 
}

 const getCarByFilter=async()=>{
    try{
        const token = await getToken()
           const response=await fetch('/api/getCarByFilters?search=&make=Porsche&minPrice=10000&maxPrice=900000&page=1&limit=6&sortBy=priceDesc',{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    const result=await response.json()
    console.log("seefilter",result)
    


    }catch(error){
     console.error("Error fetching users:", error)
}
 
  }

useEffect(()=>{
  getCarByFilter()
  // console.log("dekho currwent user",currentUser)
},[])
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
      {workingHours?.map((day,index)=>{
        return (
            <div key={day.dayOfWeek || day.value} className='grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50'>
              <div  className='col-span-3 md:col-span-2'>
                 <div className='font-medium -ml-8 sm:-ml-5'>{day.dayOfWeek || day.label}</div>

              </div>

              <div className='col-span-9 md:col-span-2 flex items-center '>
               <Checkbox
                id={`is-open-${day.dayOfWeek || day.label}`}
                checked={workingHours[index]?.isOpen}
                onCheckedChange={
                    (checked)=>{
                      handleWorkingHourChange(index,"isOpen",checked)
                    }
                }
                
               />
               <Label htmlFor={`is-open-${day.label}`}  className="ml-2 cursor-pointer" >
                {workingHours[index]?.isOpen?"Open":"Closed"}
               </Label>
                


              </div>
             {workingHours[index]?.isOpen && (<>
             <div className='col-span-5 md:col-span-3'>
                <div className='flex items-center'>
                  <Clock className='h-4 w-4 text-gray-400 mr-2'/>
                  <Input 
                    type="time"
                    value={workingHours[index]?.openTime}
                    onChange={(e)=>handleWorkingHourChange(index,"openTime",e.target.value)

                    }       

                    className="text-sm"
                  />
                </div>
                </div>
                <div className='text-center col-span-1'>
                  to
                </div>
             
             <div className='col-span-5 md:col-span-3'>
                  <div className='flex items-center'>
                  <Clock className='h-4 w-4 text-gray-400 mr-2'/>
               <Input 
                    type="time"
                    value={workingHours[index]?.closeTime}
                    onChange={(e)=>handleWorkingHourChange(index,"closeTime",e.target.value)
                    
                    }       

                    className="text-sm"
                  />
                  </div>
           </div>
             
             </> 
      )}

      {!workingHours[index]?.isOpen && (
        <div className='col-span-11 md:col-span-8 text-gray-500 italic text-sm'>Closed All Day</div>
      )}

            </div>
        )
      })}
    </div>



  <div className='mt-6 flex justify-end '>
     <Button onClick={handleSaveHours}>Save Working Hours</Button>
  </div>
  </CardContent>

</Card>

  </TabsContent>
  <TabsContent value="admins">
    <Card>
  <CardHeader>
    <CardTitle>Admin Users</CardTitle>
    <CardDescription>Manage users with admin privilages</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <div className='mb-6 relative'>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input type="search" placeholder="Search users..." className="pl-9 w-full"
       value={userSearch}
       onChange={(e)=>{
        const value=e.target.value
        setUserSearch(value)
        if(value===""){
          fetchUsers()
        }
       }}
      
      />
    </div>

    {
      fetchingUser?(
      
      <div className='py-12 flex justify-center'>
        <Loader2  className="h-8 w-8 animate-spin text-gray-400"/>
      </div>):( user  ?(
          <>
          <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">User</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    
     {user && user?.length >0 &&(
    
      user?.map((user)=>(
          <TableRow key={user._id}>
         <TableCell className="font-medium">
           <div className='flex items-center gap-2'>
             <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative'>
                {user?.imageUrl ? (
                  <img 
                   src={user.imageUrl}
                   alt={user.name || 'User'}
                   className="w-full h-full object-cover"
                  />
                ):(
                  <Users />
                )}
             </div>
             <span>{user.name || 'Unnamed User'}</span>
           </div>



         </TableCell>
         <TableCell>{user.email}</TableCell>
         <TableCell>
            <Badge 
             className={
              user.role === "ADMIN" ?"bg-green-800":"bg-gray-800"
             }
            
            >{user.role}
            </Badge>

            </TableCell>
            <TableCell className="text-right ">
                 {user.role === "ADMIN"?(
                  <Button 
                   variant="outline"
                   size="sm"
                   className="text-red-600"
                   onClick={()=>{setUpdateDialogOpen(true)
                    setCurrentUser(user)
                   }}
                  
                  >
                <UserX className='h-4 w-4 mr-2' />
                  Remove Admin
                  </Button>
                 ):(
                  <Button
                   variant="outline"
                   size="sm"
                   onClick={()=>{ setUpdateDialogOpen(true)
                  
                    setCurrentUser(user)
                    
                  }}
                   disabled={isUpdatingRole}
                  >
                    <Shield className='h-4 w-4 mr-2' />

                   Make Admin
                  </Button>
                 )}

         </TableCell>
         </TableRow>


      ))
     )}
      
   
  </TableBody>
</Table>
          
          
          
          
          </> 

      ):( 
       <> 
       <div className='py-12 text-center'>
          <Users className='h-12 w-12 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-1'>
            No Users Found
          </h3>
          <p>
          {
            fetchResults.length===0 ? "No users match your search criteria":"There are no users registered"

          }
          </p>
       </div>
       </>
      )
          
   ) }
  </CardContent>

</Card>
  </TabsContent>
</Tabs>

<Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>{
        currentUser?.role === "ADMIN"?`Confirm Remove ${currentUser?.name} From ${currentUser?.role}`: `Confirm Grant Admin Access To ${currentUser?.name}`
        
        } </DialogTitle>
      <DialogDescription>
         {
           currentUser?.role === "ADMIN"?`Are you sure you want to remove ${currentUser?.name} From ${currentUser?.role} ? This action cannot be undone`
           :`Are you sure you want to grant admin access to ${currentUser?.name} 
           This action cannot be undone`


         }
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button
      variant='outline'
      onClick={()=>{
        
        setUpdateDialogOpen(false)
        setCurrentUser(null)
      
      }}
       disabled={isUpdatingRole}

      >
       Cancel
      </Button>

      <Button
       variant="destructive"
       onClick={()=>{
        setIsUpdatingRole(true)
        currentUser?.role==="ADMIN"?handleRemoveAdmin(currentUser): handleMakeAdmin(currentUser)
       }}
      
      >
        {isUpdatingRole ?(
           <> Updating...</>
        ):(
         'Update Role'
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default SettingForm
