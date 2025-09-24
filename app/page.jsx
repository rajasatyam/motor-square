'use client'

import CarCard from "@/components/CarCard";
import HomeSearch from "@/components/home-search";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [featuredCars,setFeaturedCars]=useState(null)
  const [isClicked,setIsClicked]=useState(false)

  const search=""
     const getCars=async(search)=>{
            const response=  await fetch(`/api/getCarsBySearch?search=`)
            const result=await response.json()
            console.log(result,"api result dekho")
            setFeaturedCars(result?.serializedCars)
      
          console.log(featuredCars,"car dekho  ")
          
    }
useEffect(()=>{
  getCars()
},[])

useEffect(()=>{
 console.log(isClicked,"dekho state")
},[isClicked])
  
  return (
 <div className="pt-20 flex flex-col ">
 <section className={`relative  md:py-28 ${isClicked?"h-[65vh] sm:h-[76vh] md:h-[89vh] lg:h-[92vh]":"h-[40vh] sm:h-[63vh] md:h-[70vh] lg:h-[80vh]"}  xl:h-[90vh]`}

   style={{
    
    backgroundImage: "url('https://ucarecdn.com/0ff36833-b916-4136-a920-6237a7d0db78/')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
 
 
 >
    <Image 
      width={100}
  height={100} 
    src="/body/image-2.svg"
    className={`hidden sm:block absolute left-0  ${isClicked?"sm:top-[85.5%] md:top-[72%] lg:top-[64.5%] xl:top-[62%] 2xl:top-[58.5%] w-[47%]":"sm:top-[69%] md:top-[65%] lg:top-[55%] w-[50%]"} -translate-y-1/3  object-cover pointer-events-none z-0`}
    alt="Left image"
        priority={true}
  />

  <Image
  width={100}
  height={100} 
    src="/body/image-102.svg"
    className={`hidden sm:block absolute right-0 top-1/2  ${isClicked?"sm:top-[89%] md:top-[79.5%] lg:top-[76.5%] xl:top-[77%] 2xl:top-[79%] w-[47%]":"sm:top-[66.5%] md:top-[62%] lg:top-[55%] xl:top-[50%] 2xl:top-[58%] w-[50%]"} -translate-y-1/2  object-cover mt-10 pointer-events-none z-0`}
    alt="Right image"
    priority={true}
  />
  <div className={` w-full  ${isClicked?"flex flex-col justify-center":""} ` }>
  <div className={`max-w-[40rem] 2xl:max-w-[45rem] text-center  px-2 sm:px-0  ${isClicked?"self-center mt-10 xs:mt-0 sm:mt-1 md:-mt-14 lg:-mt-10 xl:-mt-2 2xl:-mt-10":"lg:ml-[6rem] xl:ml-[16rem] mt-10 xs:mt-7 sm:mt-7 md:-mt-4 lg:-mt-10 xl:-mt-3 2xl:mt-2"} jockey-one-regular`}>
    <div className="mb-8">
      {/* <h1 className="text-5xl md:text-5xl mb-4 text-[#00B0FF] jockey-one-regular flex flex-col gap-y-2 gradient-titl"><div className="text-white ">FIND YOUR DREAM CAR</div> WITH MOTOR SQUARE</h1> */}
      <h1 className="text-[2rem]  xs:text-[2.7rem] sm:text-[2.5rem] md:text-[2.6rem] lg:text-5xl xl:text-[3.5rem] 2xl:text-[3.9rem]  lg:mb-4 text-[#00B0FF] jockey-one-regular tracking-tight flex flex-col md:-mt-10 lg:gap-y-2"><div className="text-white ">FIND YOUR DREAM CAR</div><div className="sm:-mt-4 md:-mt-4 lg:mt-0 xl:-mt-1.5 2xl:mt-0">WITH MOTOR SQUARE</div></h1>
      {/* <p className="text-xl  mb-8 max-w-2xl mx-auto text-white">
        Advanced AI Car Search and test drive from thousands of vehicles
      </p> */}
    </div>
    <div className={`  ${isClicked?"xl:-mt-7 2xl:-mt-8 -mt-8 sm:-mt-8 md:-mt-7 ":"-mt-7 sm:-mt-7 md:-mt-8  lg:-mt-5 mx-auto sm:mx-0 w-[90%] sm:w-[80%] md:w-[80%] lg:w-full sm:ml-14 md:ml-14 lg:ml-0"} 2xl:-mt-7 z-10 relative md:ml-0 lg:ml-0  lg:w-full`} >
<HomeSearch setIsClicked={setIsClicked}/>
    </div>
    </div>



  </div>
 </section>

 <section className="sm:mt-7 md:mt-3 py-12 w-full">
    <div className="container w-full mx-auto md:mx-auto lg:mx-auto px-4">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold">Featured Cars</h2>
    <Button variant="ghost" className="flex items-center" asChild>
      <Link href="/cars">
           View All <ChevronRight className="ml-1 h-4 w-4"/>
      </Link>
 
    </Button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
    {featuredCars?.map((car)=>(
 
    car?.featured ? <CarCard key={car._id} car={car} /> : null
    ))}

    {!featuredCars && (
<>
  {Array(3).fill(0).map((_, i) => (
    <Card
      key={i}
      className="overflow-hidden hover:shadow-lg transition group py-0"
    >

      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4 space-y-3">

        <div className="flex flex-col mb-2 space-y-2">
          <Skeleton className="h-6 w-2/3" /> 
          <Skeleton className="h-6 w-1/3" /> 
        </div>


        <div className="flex gap-2 mb-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

    
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>


        <div className="flex justify-between">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  ))}
</>

    )}
  </div>
</div>
 </section>

  <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold">Browse by Make</h2>
    <Button variant="ghost" className="flex items-center" asChild>
      <Link href="/cars">
           View All <ChevronRight className="ml-1 h-4 w-4"/>
      </Link>
 
    </Button>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
{carMakes.map((make)=>(
<Link key={make.name}  href={`/cars?make=${make.name}`}
className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
>

  <div className="h-16  w-auto mx-auto mb-2 relative">
    <Image src={make.image} alt={make.name} fill 
    style={{objectFit:"contain"}}
    />
  </div>
  <h3 className="font-medium">{make.name}</h3>

 
</Link>
))}



  </div>
</div>
 </section>

       <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#F58AD5] text-[#FF1493] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified vehicles from trusted dealerships and
                private sellers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#F58AD5] text-[#FF1493]  rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">
                Book a test drive online in minutes, with flexible scheduling
                options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#F58AD5] text-[#FF1493]  rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Verified listings and secure booking process for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

        <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold">Browse by Body Type</h2>
    <Button variant="ghost" className="flex items-center" asChild>
      <Link href="/cars">
           View All <ChevronRight className="ml-1 h-4 w-4"/>
      </Link>
 
    </Button>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
{bodyTypes.map((type)=>(
<Link key={type.name}  href={`/cars?bodyType=${type.name}`}
className="relative group cursor-pointer"
>

  <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
    <Image src={type.image} alt={type.name} fill 
    style={{objectFit:"contain"}}
    className="object-cover w-48 h-full group-hover:scale-105 transition duration-300"
    />
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
<h3 className="text-white text-xl font-bold pl-4 pb-2">{type.name}</h3>
  </div>
  
0
 
</Link>
))}



  </div>
</div>
 </section>
  {/* FAQ Section with Accordion */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16  text-white" style={{
    backgroundImage: "url('https://ucarecdn.com/0ff36833-b916-4136-a920-6237a7d0db78/')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>


 </div>
  );
}
