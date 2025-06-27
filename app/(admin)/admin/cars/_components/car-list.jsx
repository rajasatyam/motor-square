import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Carlist = () => {

    const router=useRouter()

    const handleSubmit=async()=>[

    ]
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button onClick={()=>{router.push("/admin/car")}} className="flex text-center">
            <Plus className='h-4 w-4'/>Add Car
        </Button>
        <form onSubmit={handleSubmit}>
            <div className='relative flex-1'>
                <Search className='absolute left-2.5top-2.5 h-4 w-4 text-gray-500'/>
                <Input/>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Carlist
