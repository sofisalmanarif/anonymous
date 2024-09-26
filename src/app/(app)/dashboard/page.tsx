import MessageCard from '@/components/MessageCard'
import React from 'react'

const page = () => {
  return (
    <div className='px-20 py-10 flex gap-10 flex-wrap'><MessageCard/>
    <MessageCard/>
    <MessageCard/>
    <MessageCard/>
    <MessageCard/>

    <MessageCard/>
    </div>
  )
}

export default page