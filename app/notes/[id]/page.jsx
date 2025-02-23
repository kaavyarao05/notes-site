"use client"
import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'

const page = () => {
  const id=usePathname().split("/")[2];
  const setUp=async()=>{
    const dat=await supabase.from('notes-noink').select("*").eq("id",id);
    const prop=dat.data[0];

    const col=prop.color;
    const content=prop.content;
    const title=prop.title;
    
    document.body.style.backgroundColor=col
    document.getElementById("title").innerHTML=title;
    document.getElementById("content").innerHTML=content;

  }
  useEffect(()=>{
    setUp()
  })
  return (
    <div>
      <div id="title"/>
      <div id="content"/>
    </div>
  )
}

export default page