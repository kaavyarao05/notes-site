"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

const page = () => {
  return (
    <div>{usePathname()}</div>
  )
}

export default page