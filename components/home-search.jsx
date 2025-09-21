'use client'

import React, { useCallback, useState } from 'react'
import { Input } from './ui/input'
import { Camera, Upload } from 'lucide-react'
import { Button } from './ui/button'
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const HomeSearch = () => {
const [searchTerm,setSearchTerm]=useState("")
const [isImageSearchActive,setIsImageSearchActive]=useState(false)
const [imagePreview,setImagePreview]=useState("")
const [searchImage,setSearchImage]=useState(null)
const [isUploading,setIsUploading]=useState(false)



const router=useRouter();

const handleImageSearch=async(e)=>{
e.preventDefault();
if(!searchImage){
  toast.error("Please Upload The Image First")
}

console.log("dekho image search",searchImage)
try{

  const formData=new FormData()
  formData.append("file",searchImage)
   const response=await fetch(`/api/gemini-test`,{
    method:"POST",
      body:formData
        
      
})

const result=await response.json()
  console.log(result,"gemini response")
  const params=new URLSearchParams()
  if(result?.carDetails?.make) params.set("make",result.carDetails.make)
     if(result?.carDetails?.bodyType) params.set("bodyType",result.carDetails.bodyType)

       if(result?.carDetails?.color) params.set("color",result.carDetails.color)
        setTimeout(()=>{
      router.push(`/cars?${params.toString()}`)
      },1000)
        
}catch(error){
  toast.error("error fetching ai response"+error)
  console.log(error)
}



}
  const handleTextSubmit=async(e)=>{
e.preventDefault();
if(!searchTerm.trim()){
  toast.error("Please Enter A Search Term")
return;
}
router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
  }
   const onDrop = (acceptedFiles) => {
 

    const file=acceptedFiles[0];
    console.log(file)
    if(file&& file.size>5*1024*1024){
      toast.error("iMAGE SIZE IS LESSER THAN 5 MB")
          return
    }
    setIsUploading(true)
    setSearchImage(file)

    const reader=new FileReader()

    reader.onloadend=()=>{
      setImagePreview(reader.result)
      console.log(reader.result,"see result")
      setIsUploading(false)
      toast.success("Image Uploaded Successfully")
    }

    reader.onerror=()=>{
      setIsUploading(false)
      toast.error("Failed to read the image")
    }

    reader.readAsDataURL(file)
  }


  const {getRootProps, getInputProps, isDragActive,isDragReject} = useDropzone({onDrop,
    accept:{
      "image/*":[".jpeg",".jpg",".png"]
    },
    maxFiles:1,
  })
  return (
    <div>
   <form onSubmit={handleTextSubmit}>
    <div className='relative flex items-center'>
<Input
type="text"
placeholder='Enter make,model or use our AI image search...'
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
className='pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm ml-2 mr-1 placeholder-black '
/>

<div className='absolute right-[100px]'>
  <Camera 
  size={35}
  onClick={()=>{setIsImageSearchActive(!isImageSearchActive)}}
  
 className={`cursor-pointer rounded-xl p-1.5 ${isImageSearchActive?"bg-[#F58AD5]":""} ${isImageSearchActive?"text-white":"text-[#F58AD5]"}`}

  />
</div>
<Button 
type="submit"
className='absolute right-2 rounded-full  bg-[#F58AD5] border border-[#C2185B] hover:bg-[#F58AD5]'
>
  Search
</Button>
    </div>

   </form>

 {isImageSearchActive && (
  <div>
    <form onSubmit={handleImageSearch}>
      <div className='border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center mt-3   mx-2'>{imagePreview?<div className='flex flex-col items-center'>

        <img 
        src={imagePreview}
        alt="Car Preview"
        className='h-40 object-contain mb-4'
        />
 
        <Button
        variant="outline"
        onClick={()=>{
          setSearchImage(null)
          setImagePreview("")
          toast.info("IMAGE REMOVED")
        }}
        >
         Remove Image
        </Button>
      </div>:(
         <div {...getRootProps()} className='cursor-pointer '>
      <input {...getInputProps()} />
      <div className='flex flex-col items-center '>

<Upload className='h-12 w-12 text-gray-400 mb-2 '/>
      <p className='text-gray-500 mb-2'>
  {
        isDragActive && !isDragReject ?
          "leave the file here to upload" :
          "Drag & drop some files here, or click to select files"
      }
      </p>
      {isDragReject && (
        <p className='text-red-500 mb-2'>
       
       invalid image type
        </p>
      )}
      <p className='text-gray-400 text-sm'>Supports:JPG,PNG (max 5MB) </p>
        
      </div>
      
    
    </div>
      )}</div>

      {imagePreview && (
        <Button
        type="submit"
        variant="outline"
        className="w-[97%] mt-2 "
        disabled={isUploading}
        
        >
{isUploading?"Uploading...":"Search With This Image"}

        </Button>
      )}
    </form>
  </div>
 )}
    </div>
  )
}

export default HomeSearch
