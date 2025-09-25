
import React from 'react'
import SavedCarsList from './_components/saved-cars-list'
import { auth } from '@clerk/nextjs/server'

const SavedCarPage = async() => {

    const {userId}=await auth()
      
    if(!userId){
        redirect('/sign-in?redirect=/saved-cars')
    }
  return (
    <>

    <div className='container mx-auto -my-2 '>
  <img 
    src="/body/image-21.svg"
    className="absolute right-0 top-[40%] -translate-y-1/2 w-[40%] object-cover z-10"
    alt="Right image"
  />

        <SavedCarsList />
    </div>
</>
  )
}

export default SavedCarPage