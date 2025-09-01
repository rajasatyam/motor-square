
import React from 'react'
import CarFilters from './_components/carFilters'
import CarListing from './_components/carListing'

export const metadata={
    title:"Cars | MotorSquare",
    description: "Browse and search for your dream car"
}

const CarsPage = () => {



  return (
    <div className='comntainer mx-auto px-4 py-12'>
      <h1 className='text-6xl mb-4 gradient-title'>Browse Cars</h1>

      <div>

        <div className='flex flex-col lg:flex-row gap-8'>
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
