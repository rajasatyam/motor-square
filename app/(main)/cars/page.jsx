
import React from 'react'
import CarFilters from './_components/carFilters'
import CarListing from './_components/carListing'

export const metadata={
    title:"Cars | MotorSquare",
    description: "Browse and search for your dream car"
}

const CarsPage = () => {



  return (
    <div className='container mx-auto  -my-4'>
        <img 
    src="/body/image-47.svg"
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
      {/* <h1 className='text-6xl mb-4 gradient-title'>Browse Cars</h1> */}

      <div>

        <div className='flex flex-col lg:flex-row gap-8 mt-20'>
           <div className='w-full lg:w-80 flex-shrink-0'>{/* Filter */}

            <CarFilters  />
           </div>
          <div className='flex-1'>{/* Listing */}
            <CarListing/>
          </div>
        </div>


      </div>
    </div>
  )
}

export default CarsPage
