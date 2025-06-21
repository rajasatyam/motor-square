import CarCard from "@/components/CarCard";
import HomeSearch from "@/components/home-search";
import { Button } from "@/components/ui/button";
import { featuredCars } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
 <div className="pt-20 flex flex-col">
 <section className="relative py-16 md:py-28 dotted-background">
  <div className="max-w-4xl mx-auto text-center">
    <div className="mb-8">
      <h1 className="text-5xl md:text-8xl mb-4 gradient-title">Find Your Dream Car With Vehiql</h1>
      <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
        Advanced AI Car Search and test drive from thousands of vehicles
      </p>
    </div>
    <HomeSearch/>
  </div>
 </section>

 <section className="py-12">
  <div>
    <h2>Featured Cars</h2>
    <Button>
      View All <ChevronRight className="ml-1 h-4 w-4"/>
    </Button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {featuredCars.map((car)=>(
      <CarCard key={car.id} car={car}/>
    ))}
  </div>

 </section>
 </div>
  );
}
