'use client'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {  Check, X } from 'lucide-react'
import React from 'react'
import { SelectionState } from 'react-day-picker'

const CarFilterControl = ({
    filter,
    currentFilters,
    onFilterChange,
    onClearFilter
}) => {

  const {make,bodyType,fuelType,transmission,priceRange}=currentFilters

  const filterSections=[
    {
      id:"make",
      title:"Make",
      options:filter?.make.map((make)=>({value:make,label:make})),
      currentValue:make,
      onChange:(value)=>onFilterChange("make",value),

    },
        {
      id:"bodyType",
      title:"BodyType",
      options:filter?.bodyType.map((type)=>({value:type,label:type})),
      currentValue:bodyType,
      onChange:(value)=>onFilterChange("bodyType",value),

    },
        {
      id:"fuelType",
      title:"Fuel Type",
      options:filter?.fuelType.map((type)=>({value:type,label:type})),
      currentValue:fuelType,
      onChange:(value)=>onFilterChange("fuelType",value),

    },
        {
      id:"transmission",
      title:"Transmission",
      options:filter?.transmission.map((type)=>({value:type,label:type})),
      currentValue:transmission,
      onChange:(value)=>onFilterChange("transmission",value),

    },
  ]

  console.log("real filter",filter)
  return (
    <div className='space-y-6'>
     <div className='space-y-4'>
      <h3 className='font-medium'>Price Range</h3>
      <div className='px-2'>
        <Slider 
        min={filter?.priceRange[0]?.minPrice} 
        max={filter?.priceRange[0]?.maxPrice}
        step={100}
        value={priceRange}
        onValueChange={(value)=>onFilterChange('priceRange',value)}
        />
      </div>
      <div className='flex items-center justify-between'>
        <div className='font-medium text-sm'>$ {priceRange[0]}</div>
        <div className='font-medium text-sm'>$ {priceRange[1]}</div>
      </div>
         
     </div>
     {filterSections?.map((section)=>(
      <div key={section?.id} className='space-y-3'>
        <h4 className='text-sm font-medium flex justify-between'>
           <span>{section?.title}</span>
           {section?.currentValue && (
                   <button 
              className='text-xs text-gray-600 flex items-center'
              onClick={()=>onClearFilter(section.id)}
             >
               <X className='mr-1 h-3 w-3' />
               Clear
             </button>
           )}
        

        </h4>
        {section?.options?.map((option)=>(
          <Badge key={option.value}>
            {option.label}
            {section.currentValue === option.value && (
              <Check className="ml-1 h-3 w-3 inline" />
            )}
          </Badge>
        ))}
      </div>
     ))}
    </div>
  )
}

export default CarFilterControl
