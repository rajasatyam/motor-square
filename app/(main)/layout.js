'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

const layout = ({children}) => {
  const pathname= usePathname()
  console.log(pathname,"path.....")
    const hideSection = pathname.startsWith('/cars')
  return (
    <>
    {!hideSection && (
               <section className=" bg-gradient-to-b from-[#F58AD580] to-[#3EBEF780] h-[50vh] -z-10 ">



  {/* <div className="max-w-xl  text-center -mt-8 ml-60">
    <div className="mb-8">

      <h1 className="text-5xl md:text-[3rem] mb-4 text-[#00B0FF] jockey-one-regular flex flex-col gap-y-2"><div className="text-white ">FIND YOUR DREAM CAR</div>WITH MOTOR SQUARE</h1>
  
    </div>
 



  </div> */}
 </section>
    )}

    <div className='container mx-auto my-22'>
      {children}
    </div>
    </>
  )
}

export default layout
