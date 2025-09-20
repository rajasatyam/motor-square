
import React from 'react'
import SavedCarsList from './_components/saved-cars-list'
import { auth } from '@clerk/nextjs/server'

const SavedCarPage = async() => {

    const {userId}=await auth()
      
    if(!userId){
        redirect('/sign-in?redirect=/saved-cars')
    }
  return (
    <div className='container mx-auto -my-2 '>
  <img 
    src="/body/image-21.svg"
    className="absolute right-0 top-[40%] -translate-y-1/2 w-[40%] object-cover z-10"
    alt="Right image"
  />
       <section className="relative bg-gradient-to-b from-[#F58AD580] to-[#3EBEF780] h-[40vh] -z-10">



  {/* <div className="max-w-xl  text-center -mt-8 ml-60">
    <div className="mb-8">

      <h1 className="text-5xl md:text-[3rem] mb-4 text-[#00B0FF] jockey-one-regular flex flex-col gap-y-2"><div className="text-white ">FIND YOUR DREAM CAR</div>WITH MOTOR SQUARE</h1>
  
    </div>
 



  </div> */}
 </section>
        <SavedCarsList />
    </div>

  )
}

export default SavedCarPage