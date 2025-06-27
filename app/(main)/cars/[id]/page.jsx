import React from 'react'

const carPage = async ({params}) => {

    const {id}=await params
  return (
    <div>
      Carpage:{id}
    </div>
  )
}

export default carPage
