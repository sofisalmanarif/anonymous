"use client"
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { DividerHorizontalIcon } from '@radix-ui/react-icons'

const Navbar = () => {
    const {data,status} = useSession()
    console.log(data,status)
    const user: User = data?.user as User
  return (
    <nav className='flex items-center px-20 justify-between py-3 border-b-2 border-zinc-700'>
    <Link href={"/"} className='text-2xl '>Anonymous</Link>
    {
        data ?
        <div className='flex  items-center gap-5'>
            <p>Welcome,{data.user.username}</p>
            <Button onClick={()=>signOut()} variant={'secondary'}>Log Out</Button>
        </div> :
        <Button>log In</Button>
    }
    
    </nav>
  )
}

export default Navbar