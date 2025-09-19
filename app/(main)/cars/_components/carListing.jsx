'use client'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CarListingsLoading from './carListingLoading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CarCard from '@/components/CarCard'

const CarListing = () => {
  
  const searchParams=useSearchParams()
  const router=useRouter()
  const [currentPage,setCurrentPage]=useState(1)
  const limit=6;
  const [result,setResult]=useState(null)
  const [error,setError]=useState(null)


  const search=searchParams.get('search')||""
  const make=searchParams.get('make') || ""
  const bodyType=searchParams.get('bodyType') || ""
  const fuelType=searchParams.get('fuelType') || ""
  const transmission=searchParams.get('transmission') || ""
  const minPrice=searchParams.get('minPrice') || 0
  const maxPrice=searchParams.get('maxPrice') || Number.MAX_SAFE_INTEGER
  const sortBy=searchParams.get('sortBy') || "newest"
  const page=parseInt(searchParams.get('page') || "1")
  
  const { getToken } = useAuth();

 const getCarByFilter=async()=>{
    try{
        const token = await getToken()
           const response=await fetch(`/api/getCarByFilters?search=${search}&make=${make}&bodyType=${bodyType}&fuelType=${fuelType}&transmission=${transmission}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}&page=${page}&limit=6`,{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    const result=await response.json()
    console.log("seefilter",result)
    setResult(result)
    

    }catch(error){
     console.error("Error fetching users:", error)
     setError(error)
}
 
  }

  useEffect(()=>{
    getCarByFilter()
  },[search,make,bodyType,fuelType,transmission,minPrice,maxPrice,sortBy,page])

  



  if(!result){
    return <CarListingsLoading/>
  }

if(error ){
   return (
    <Alert variant="destructive">
  <Info />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to load cars.Please try again later
  </AlertDescription>
</Alert>
   )
  }

  const {data:cars,pagination}=result;
    console.log(cars,"dekho data")
  if(cars?.length === 0){
    return (
      <div className='min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50'>
        <div className='bg-gray-100 p-4 rounded-full mb-4'>
          <Info className='h-8 w-8 text-gray-500'/>
        </div>
        <h3 className='text-lg font-medium mb-2'>No Cars Found</h3>
        <p className='text-gray-500 mb-6 max-w-md'>
          We couldn't find any cars matching your search criteria.Try adjusting your filters or search term.
        </p>
        <Button variant="outline" asChild>
          <Link href="/cars">Clear all filters</Link>
        </Button>

      </div>
    )
  }

  
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <p className='text-gray-600'>
           Showing{" "}
           <span className='font-medium'>
            {(page-1)*limit+1}-{Math.min (page*limit,pagination.total)}
           </span>{" "}
           of <span className='font-medium'>{pagination.total}</span>
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
         {cars?.map((car)=>(
          <CarCard key={car._id} car={car}/>
         ))}
      </div>
    </div>
  )
}

export default CarListing

