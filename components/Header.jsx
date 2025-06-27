import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { ArrowLeft, CarFront, Heart, Layout } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
// import { checkUser } from '@/lib/checkUser'
import { getAdmin } from '@/actions/admin'






const Header = async({isAdminPage=false}) => {

    // const user=await checkUser();

    // const isAdmin=user?.role === "ADMIN"
    const checkAdmin=await getAdmin()

    const isAdmin=checkAdmin.user.role
console.log(checkAdmin.user.role,"piyush")



    
    


  return (
   <header className='fixed top-0 w-full bg-white/80 backdrop-blur-xl flex z-50 border-b justify-between'>
    <nav className=' px-4 py-4 '>
        <Link href={isAdminPage?"/admin":"/"} className='flex'>
        <Image src={"/logo.png"} alt="Vehiql Logo"
        width={200}
        height={60}
        className='h-12 w-auto object-contain'
        />
        {isAdminPage && (
            <span className='text-xs font-extralight'>Admin</span>
        )}
        </Link>
    </nav>

    <div className='flex items-center space-x-1'>
        {isAdminPage?(
                <Link href="/">
              <Button className='flex items-center gap-2' variant="outline">
                <ArrowLeft size={18}/>
                <span className='hidden md:inline'>Back To App</span>
                </Button>
            </Link>
        ):(
  <SignedIn>
         
            <Link href="/saved-cars">
              <Button className='my-6 mx-4'>
                <Heart size={18}/>
                <span className='hidden md:inline'>Saved Cars</span>
                </Button>
            </Link>

            {!isAdmin ? (
          <Link href="/reservations">
              <Button variant="outline">
                <CarFront size={18}/>
                <span className='hidden md:inline'>My Reservations</span>
                </Button>
            </Link>
            ):(
           <Link href="/admin">
              <Button variant="outline">
                <Layout size={18}/>
                <span className='hidden md:inline'>Admin Portal</span>
                </Button>
            </Link>
            )}
        
         
        </SignedIn>
        )}

        <SignedOut>
            <SignInButton forceRedirectUrl='/'>
                <Button variant="outline">
                 Login
                </Button>
            </SignInButton>
        </SignedOut>

        <SignedIn>
            <UserButton 
            appearance={{
                elements:{
                    avatarBox:"w-10 h-10"
                }
            }}
            />
        </SignedIn>

      
    </div>
   </header>
  )
}

export default Header
