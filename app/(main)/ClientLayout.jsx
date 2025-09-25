// app/(main)/ClientLayout.js
'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

const ClientLayout = ({ children }) => {
  const pathname = usePathname()
const hiddenPaths = ['/cars', '/test-drive']
const hideSection = hiddenPaths.some(path => pathname.startsWith(path))


  return (
    <>
      {!hideSection && (
        <section className="bg-gradient-to-b from-[#F58AD580] to-[#3EBEF780] h-[50vh] -z-10">
          {/* Optional content */}
        </section>
      )}
      <div className="container mx-auto my-22">{children}</div>
    </>
  )
}

export default ClientLayout
