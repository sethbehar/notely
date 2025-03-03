import {Navbar} from '@/components/navbar';
import React from 'react'
import Note from '@/components/note';

const page = () => {
  return (
    <>
        <div className="min-h-screen bg-white">
            <Navbar />
            <Note />
        </div>
    </>
  )
}

export default page