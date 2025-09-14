
import React from 'react'
import SavedCarsList from './_components/saved-cars-list'
import { auth } from '@clerk/nextjs/server'

const SavedCarPage = async() => {

    const {userId}=await auth()
      
    if(!userId){
        redirect('/sign-in?redirect=/saved-cars')
    }
  return (
    <div className='container mx-auto px-4 py-12'>

        <h1 className='text-6xl mb-6 gradient-title'>Your Saved Cars</h1>
        <SavedCarsList />
    </div>
  )
}

export default SavedCarPage