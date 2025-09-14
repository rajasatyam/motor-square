'use client'
import React from 'react'
import useGetCars from '../hooks/useGetCars';
import { useParams } from 'next/navigation';
import CarDetails from './_components/carDetails';


const carPage =  () => {

  const params=useParams()
  console.log("deklho params",params)

    const {id}= params
    const { car, loading, error } = useGetCars(id)
   console.log(car,"gaadi")
  return (
    <div className='container mx-auto px-4 py-12'>
     <CarDetails car={car?.data} testDriveInfo={car?.data?.testDriveInfo}/>
    </div>
  )
}

export default carPage
