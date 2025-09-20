"use client"


import { deleteCars, getCars, updateCarStatusFn } from '@/actions/car'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useFetch from '@/hooks/use-fetch'
import { CarIcon, Eye, Loader2, MoreHorizontal, Plus, Search, Star, StarOff, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Carlist = () => {

    const router=useRouter()
    const [search,setSearch]=useState("")
    const [carsData,setCarsData]=useState(null)
    const [loadingCars,setIsLoadingCars]=useState(true)
   const [updateResult,setUpdateResult]=useState()

   const [carToDelete,setCarToDelete]=useState(null)
   const [deleteDialogOpen,setDeleteDialogOpen]=useState(false)

   const [deletingCar,setDeletingCar]=useState(false)

   const [isUpdating,setIsUpdating]=useState(false)



    const getCars=async(search)=>{
            const response=  await fetch(`/api/getCarsBySearch?search=${search}`)
            const result=await response.json()
            console.log(result,"api result dekho")
            setCarsData(result?.serializedCars)
            setIsLoadingCars(false)
          console.log(carsData,"car dekho  ")
          
    }
    
 


 useEffect(() => {
  const handler = setTimeout(() => {
    getCars(search);
  }, 5000);

  
  return () => {
    clearTimeout(handler);
  };
}, [search]);

    const handleSubmit=async(e)=>{
        e.preventDefault()
      
    }

    const getStatusBadge=(status)=>{
     switch(status){
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
        case "UNAVAILABLE":
          return (
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Unavailable
            </Badge>
          )
          case "SOLD":
            return (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Sold
              </Badge>
            )
          default:
            return (
              <Badge variant="outline">
                {status}
              </Badge>
            )
     }
    }

    const handleUpdate=async(car,action)=>{
      const {_id}=car
       console.log("dekh car pk",car)
      console.log("dekho car bdcoe",_id)
      
      let updatedFeatured=car.featured;
      let updatedStatus=car.status;
      
      if(action === "toggleFeatured"){
        updatedFeatured=!car.featured
      }
      else if(action === "AVAILABLE"){
             updatedStatus="AVAILABLE"
      }
      else if(action === 'UNAVAILABLE'){
          updatedStatus= 'UNAVAILABLE'
      }


        const response=  await fetch(`/api/updateCar?id=${_id}&featured=${updatedFeatured}&status=${updatedStatus}`,{
          method:'PUT'
        })
        const result=await response.json()
        console.log(result,'resultpk')
     
          if(response.ok){
            setIsUpdating(true)
          toast.success("Car Updated Successfully")
          // window.location.reload()
          setCarsData(result?.data)
          setIsUpdating(false)
          }

       


    }

        const handleDeleteCar=async(carToDelete)=>{
   
      const {_id}=carToDelete
       console.log("id.....",_id)
       try{
                const response=await fetch(`/api/deleteCar?id=${_id}`,{
          method:'DELETE'
        })
        const result=await response.json()
          if(response.ok){
          toast.success("Car Deleted Successfully")
          setDeleteDialogOpen(false)
          setCarToDelete(null)
          setCarsData(result?.data)
          console.log("del response",result)
          }

       }catch(error){
        toast.error("Car not deleted successfully")
       }


    }


    
  return (
    <div className="space-y-4 ">
      <div className="flex w-full flex-col  sm:flex-row gap-4 items-start sm:items-center justify-between ">
        <Button onClick={()=>{router.push("/admin/cars/create")}} className="flex items-center">
            <Plus className='h-4 w-4'/>Add Car
        </Button>
        <form onSubmit={handleSubmit} className='flex w-full sm:w-auto '>
            <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500'/>
                <Input
                 className="pl-9 w-full sm:w-60" 
                value={search}
                onChange={(e)=>{setSearch(e.target.value)}}
                type='search'
                placeholder="SearchCars..."
                />
            </div>
        </form>
      </div>

      <Card>
  
  <CardContent>
  
     {loadingCars && !carsData ? (
      <div>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400'/>
      </div>
     ):(
      carsData && carsData.length>0?(
        <div className='overflow-x-auto'>
          <Table>

  <TableHeader>
    <TableRow>
      <TableHead className="w-20"></TableHead>
      <TableHead className="mr-2">Make & Model</TableHead>
      <TableHead>Year</TableHead>
      <TableHead>Price</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Featured</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
     {carsData?.map((car)=>{
      return (
         <TableRow key={car?._id}>
      <TableCell className="mr-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative">
                          {car?.images && car?.images?.length > 0 ? (
                            <Image
                              src={car?.images[0]?.url}
                              alt={`${car?.make} ${car?.model}`}
                              height={70}
                              width={70}
                              className="w-full h-full object-cover "
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
      </TableCell>
      <TableCell>{car.make} {car.model}</TableCell>
      <TableCell>{car.year}</TableCell>
      <TableCell>${car.price}</TableCell>
      <TableCell>{getStatusBadge(car.status)}</TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-9 w-9"
        onClick={()=>handleUpdate(car,'toggleFeatured')}
        
        >
      {car.featured ?(
        <Star className='h-5 w-5 text-amber-500 fill-amber-500'/>
      ):(
       <StarOff />
      )}
        </Button>
      </TableCell>


      <TableCell className="text-right">
         <DropdownMenu >
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="sm"
      className="p-0 h-8 w-8"
    
    
    >
    <MoreHorizontal className='h-4 w-4' />
    </Button>



  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    
    <DropdownMenuItem
      onClick={()=>router.push(`/cars/${car.id}`)}
    
    >
      
      <Eye className='mr-2 h-4 w-4' />
      View</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Status</DropdownMenuLabel>
    <DropdownMenuItem  
       onClick={()=>{
        handleUpdate(car,'AVAILABLE')
       }}
    disabled={
      car.status === 'AVAILABLE' ||   isUpdating
    }
    
    >Set Available</DropdownMenuItem>
    <DropdownMenuItem 
      onClick={()=>{
        handleUpdate(car,'UNAVAILABLE')
       }}
    disabled={
      car.status === 'UNAVAILABLE' ||   isUpdating
    }
    
    
    >Set Unavailable</DropdownMenuItem>
    <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
      <DropdownMenuSeparator />
     <DropdownMenuItem className="text-red-600"  
       onClick={()=>{
        setCarToDelete(car)
        setDeleteDialogOpen(true)
       }}
     
     
     >
      <Trash  className='mr-2 h-4 w-4' />
      Delete</DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
      </TableCell>
    </TableRow>
      )
     })}
  </TableBody>
</Table>
        </div>
      ):(
       <div className='flex flex-col items-center justify-center py-12 px-4 text-center '>
         <CarIcon className='h-12 w-12 text-gray-300 mb-4'/>
         <h3 className='text-lg font-medium text-gray-900 mb-1'>
          No Cars Found
         </h3>
         <p className='text-gray-500 mb-4'>
          {search?"No cars match your search criteria ":"Your inventory is empty.Add Cars toget started."}
         </p>
         <Button onClick={()=>router.push("/admin/cars/create")} >
          Add Your First Car
         </Button>
       </div>
      )
     )}
  </CardContent>
 
</Card>



<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  
  <DialogContent >
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete {carToDelete?.make}{" "}
        {carToDelete?.model} ({carToDelete?.year})? This action cannot be undone
      </DialogDescription>
    </DialogHeader>

    <DialogFooter>
      <Button  
       variant='outline'
       onClick={()=>setDeleteDialogOpen(false)}
       disabled={deletingCar}
      
      >
        Cancel
      </Button>

      <Button  
       variant="destructive"
       onClick={()=>{
        handleDeleteCar(carToDelete)
        setDeletingCar(true)
       }}
      disabled={deletingCar}
      
      
      >
        {deletingCar?(
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
             Deleting....
          </>

        ):(
          "Delete Car"
        )}

      </Button>


    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )


}

export default Carlist
