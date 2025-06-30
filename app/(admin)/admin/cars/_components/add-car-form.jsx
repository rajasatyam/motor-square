"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {useDropzone} from 'react-dropzone'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import useFetch from '@/hooks/use-fetch'
import { addCar } from '@/actions/car'
import { Router } from 'next/router'
import { useRouter } from 'next/navigation'




const fuelTypes=['Petrol',"Diesel","Electric","Hybrid","Plug-in Hybrid"]

const transmissions=["Automatic","Manual","Semi-Automatic"]
const bodyTypes=[
    "Suv",
    "Sedan",
    "HatchBack",
    "Covertible",
    "Coupe",
    "Wagon",
    "Pickup"
]

const carStatuses=["AVAILABLE","UNAVAILABLE","SOLD"]
const currentYear = new Date().getFullYear();
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const carFormSchema=z.object({
    make:z.string().trim().min(4,{message:"Invalid make name"}).max(15,{message:"Invalid make name"}),
    model:z.string().trim().min(4,{message:"Invalid model name"}).max(15,{message:"Invalid model name"}),
    year: z.string()
  .refine(year => year.toString().length === 4, "Year must be a four-digit number"),
  price:z.string({required_error:'Price is required'}),
  mileage:z.string({required_error:'Mileage is required'}),
  color:z.string({required_error:'Color is required'}),
  fuelType:z.string({required_error:'Fuel Type is required'}),
  transmission:z.string({required_error:'Transmission is required'}),
  seats:z.string().optional(),
  description:z.string().min(10,"Description must be at least 10 characters"),
  status:z.enum(["AVAILABLE","UNAVAILABLE","SOLD"]),
  featured:z.boolean().default(false),
   images: z
  .array(
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, and .webp formats are supported."
      )
  )
  .min(1, "Please upload at least one image"),


})


const AddCarForm = () => {

    const [activeTab,setActiveTab]=useState("manual")
    const [uploadedImages,setUploadedImages]=useState([])
    const [imageError,setImageError]=useState("")
      const [uploadProgress, setUploadProgress] = useState(0);
       const [imagePreview, setImagePreview] = useState(null);

       const router=useRouter()


    const{register,
    setValue,
    getValues,
    formState:{errors,isSubmitting},
handleSubmit,
watch}=useForm({
    resolver:zodResolver(carFormSchema),
    defaultValues:{
        make:"",
        model:"",
        year:"",
        price:"",
        mileage:"",
        color:"",
        fuelType:"",
        transmission:"",
        bodyType:"",
        seats:"",
        description:"",
        status:"AVAILABLE",
        featured:false

    }
})

const {
  data:addCarResult,
  loading:addCarLoading,
  fn:addCarFn
}=useFetch(addCar)

useEffect(()=>{
if(addCarResult?.success){
  toast.success("Car Added Successfully")
  router.push("/admin/cars")
}
},[addCarResult?.success])

  const onMultiImagesDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles,".......")
const validFiles=acceptedFiles.filter((file)=>{
  if(file.size>5*1024*1024){
    toast.error(`${file.name} exceeds 5MB limit and it will be skipped`)
    return false
  }
  return true
})
if(validFiles.length===0) return;

// const newImages=[];
// validFiles.forEach((file)=>{

//   const reader=new FileReader()
  
//       reader.onload=(e)=>{
//         console.log(e.target,"see target")
//       newImages.push(e.target.result)

//       if(newImages.length===validFiles.length){
//          setUploadedImages((prev)=>[...prev,...newImages])
//          setImageError("")
//               toast.success(`successfuly uploaded ${validFiles.length} images`)
//       }
   
//       }
  

  
//       reader.readAsDataURL(file)
// })
const newFiles=[...uploadedImages,...validFiles]
  setUploadedImages(newFiles);
  setImageError("");
  toast.success(`Successfully uploaded ${validFiles.length} images`);
  setValue("images",newFiles)
  }
)


  const {getRootProps:getMultiImageRootProps, getInputProps:getMultiImageInputProps, isDragActive,isDragReject} = useDropzone({onDrop:onMultiImagesDrop,
    accept:{
      "image/*":[".jpeg",".jpg",".png",".webp"]
    },
  multiple:true,
  })



const onSubmit=async(data)=>{
  if(uploadedImages.length===0){
    setImageError("Please upload atleast one image")
    return;
  }
  console.log(data,"piyush chanchal")
  console.log(uploadedImages,"dekho images")


  const formData=new FormData()

 Object.entries(data).forEach(([key, value]) => {
  if(key==="images") return
    formData.append(key, value );
  });

  uploadedImages.forEach((file) => {
    formData.append("images", file);
  });

  console.log(formData,"see form data")

  await addCarFn(formData)


}

const removeImage=(index)=>{
setUploadedImages((prev)=>prev.filter((_,i)=>i!==index))
}




  return (
    <div>
   <Tabs defaultValue="ai" 
   value={activeTab}
   onValueChange={setActiveTab}
   className="mt-6">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
    <TabsTrigger value="ai">AI upload</TabsTrigger>
  </TabsList>
  <TabsContent value="manual">Make changes to your account here.
<Card>
  <CardHeader>
    <CardTitle>Car Details</CardTitle>
    <CardDescription>Enter The details of the car you want to add </CardDescription>
  
  </CardHeader>
  <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Make */}
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      {...register("make")}
                      placeholder="e.g. Toyota"
                      className={errors.make ? "border-red-500" : ""}
                    />
                    {errors.make && (
                      <p className="text-xs text-red-500">
                        {errors.make.message}
                      </p>
                    )}
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      {...register("model")}
                      placeholder="e.g. Camry"
                      className={errors.model ? "border-red-500" : ""}
                    />
                    {errors.model && (
                      <p className="text-xs text-red-500">
                        {errors.model.message}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      {...register("year")}
                      placeholder="e.g. 2022"
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className="text-xs text-red-500">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      {...register("price")}
                      placeholder="e.g. 25000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-xs text-red-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {/* Mileage */}
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      {...register("mileage")}
                      placeholder="e.g. 15000"
                      className={errors.mileage ? "border-red-500" : ""}
                    />
                    {errors.mileage && (
                      <p className="text-xs text-red-500">
                        {errors.mileage.message}
                      </p>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      {...register("color")}
                      placeholder="e.g. Blue"
                      className={errors.color ? "border-red-500" : ""}
                    />
                    {errors.color && (
                      <p className="text-xs text-red-500">
                        {errors.color.message}
                      </p>
                    )}
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      onValueChange={(value) => setValue("fuelType", value)}
                      defaultValue={getValues("fuelType")}
                    >
                      <SelectTrigger
                     className={` w-full ${errors.fuelType ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <p className="text-xs text-red-500">
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select
                      onValueChange={(value) => setValue("transmission", value)}
                      defaultValue={getValues("transmission")}
                    >
                      <SelectTrigger
                        className={` w-full ${errors.transmission ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <p className="text-xs text-red-500">
                        {errors.transmission.message}
                      </p>
                    )}
                  </div>

                  {/* Body Type */}
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Select
                      onValueChange={(value) => setValue("bodyType", value)}
                      defaultValue={getValues("bodyType")}
                    >
                      <SelectTrigger
                         className={` w-full ${errors.bodyType ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <p className="text-xs text-red-500">
                        {errors.bodyType.message}
                      </p>
                    )}
                  </div>

                  {/* Seats */}
                  <div className="space-y-2">
                    <Label htmlFor="seats">
                      Number of Seats{" "}
                      <span className="text-sm text-gray-500">(Optional)</span>
                    </Label>
                    <Input
                      id="seats"
                      {...register("seats")}
                      placeholder="e.g. 5"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      onValueChange={(value) => setValue("status", value)}
                      defaultValue={getValues("status")}
                    >
                      <SelectTrigger className={`w-full`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {carStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Enter detailed description of the car..."
                    className={`min-h-32 ${
                      errors.description ? "border-red-500" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Featured */}
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    id="featured"
                    checked={watch("featured")}
                    onCheckedChange={(checked) => {
                      setValue("featured", checked);
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Feature this car</Label>
                    <p className="text-sm text-gray-500">
                      Featured cars appear on the homepage
                    </p>
                  </div>
                </div>

                {/* Image Upload with Dropzone */}
                <div>
                  <Label
                    htmlFor="images"
                    className={imageError ? "text-red-500" : ""}
                  >
                    Images{" "}
                    {imageError && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="mt-2">
                    <div
                      {...getMultiImageRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition ${
                        imageError ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <input {...getMultiImageInputProps()} />
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <span className="text-sm text-gray-600">
                          Drag & drop or click to upload multiple images
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          (JPG, PNG, WebP, max 5MB each)
                        </span>
                      </div>
                    </div>
                    {imageError && (
                      <p className="text-xs text-red-500 mt-1">{imageError}</p>
                    )}
                    {uploadProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Image Previews */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">
                        Uploaded Images ({uploadedImages.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`Car image ${index + 1}`}
                              height={50}
                              width={50}
                              className="h-28 w-full object-cover rounded-md"
                              priority
                            
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto"
              
                >
                  {addCarLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Car...
                    </>
                  ) : (
                    "Add Car"
                  )}
                
                </Button>
              </form>
  </CardContent>

</Card>



  </TabsContent>
  <TabsContent value="ai">Change your password here.</TabsContent>
</Tabs>
    </div>
  )
}

export default  AddCarForm
