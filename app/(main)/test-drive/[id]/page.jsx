'use client'
import React from 'react'
import useGetCars from '../../cars/hooks/useGetCars'
import { useParams } from 'next/navigation'
import NotFound from '@/app/not-found'
import TestDriveForm from './_components/test-drive-form'




const TestDrivePage = () => {
      const params=useParams()
    const {id}=params
    const { car, loading, error } = useGetCars(id)

    if(car){
        NotFound()
    }
  return (
    <div className='container mx-auto px-4 py-12'>
        <h1 className='text-6xl mb-6 gradient-title '>Book a Test Drive</h1>
          <TestDriveForm car={car?.data} testDriveInfo={car?.data?.testDriveInfo}/>
    </div>
  )
}

export default TestDrivePage