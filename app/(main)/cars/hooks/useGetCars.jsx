'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const useGetCars = (id) => {
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

   const getCars = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/getCarById?carId=${id}`)
        const result = await response.json()
         console.log(result,"krish sir response")
        if (!response.ok) throw new Error(result.message || 'Failed to fetch car')

        setCar(result)
      } catch (err) {
        setError(err.message)
        toast.error("Error fetching car")
        setLoading(false)
      } 
    }

  useEffect(() => {
    if (!id) return

    getCars()
  }, [id])

  return { car, loading, error }
}

export default useGetCars
