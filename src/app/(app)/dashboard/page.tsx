'use client'
import MessageCard from '@/components/MessageCard'
import React from 'react'

const deleteHandler =()=>{
  console.log("first")
}
const page = () => {
  return (
    <div className='px-20 py-10 flex gap-10 flex-wrap'>
      <MessageCard message="hay" deleteHandler={deleteHandler}/>
  
    </div>
  )
}

export default page