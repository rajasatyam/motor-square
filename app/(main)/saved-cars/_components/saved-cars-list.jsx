"use client"
import CarCard from '@/components/CarCard'
import { Button } from '@/components/ui/button'
import { Heart, Info } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import CarListingsLoading from '../../cars/_components/carListingLoading'
import { toast } from 'sonner'

const SavedCarsList = () => {

       const [savedCars,setSavedCars]=useState(null)
        const [isSaving,setIsSaving]=useState(false)
        const [isRefetchCar,setRefetchCar]=useState(false)
    
    
        const getUserSavedCars=async()=>{
            const response=await fetch(`/api/getUserSavedCars`,{
                method:"GET"
            })
            const result=await response.json()
            console.log("see save",result)
            if(result){
  setSavedCars(result)
            }
           
            if(response.ok){
                toast.success("Successfully fetched user saved  cars")
            }
        }

        useEffect(()=>{
            getUserSavedCars()
        },[isRefetchCar])
          if(!savedCars){
            return <CarListingsLoading/>
          }

          const {data:cars}=savedCars;
            console.log(cars,"dekho data")
          if(cars?.length === 0){
            return (
              <div className='min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50 mt-10'>
                <div className='bg-gray-100 p-4 rounded-full mb-4'>
                  <Heart className='h-8 w-8 text-gray-500'/>
                </div>
                <h3 className='text-lg font-medium mb-2'>No Cars Found</h3>
                <p className='text-gray-500 mb-6 max-w-md'>
                 You haven't saved any cars yet.Browse our listing and click the heart icon to save cars for later
                </p>
                <Button variant="outline" asChild>
                  <Link href="/cars">Clear all filters</Link>
                </Button>
        
              </div>
            )
          }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
    {cars?.map((car)=>(
      <CarCard key={car._id} car={car} setRefetchCar={setRefetchCar}/>
    ))}
    </div>
  )
}

export default SavedCarsList