"use client"

import { useEffect, useState } from 'react';
import Card from '@/app/1components/Card';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';
import {createRoot} from 'react-dom/client';
import NavBar from '@/app/1components/Navbar';

const colors=[
  "#ffcdd6",
  "#9fffdf",
  "#a7e9ff"
]

type noteType=
{
  id:number,
  created_at:string,
  title:string,
  content:string,
  "user-email":string|null,
  color:string,
  colorChoices:Array<string>
}

type userData={
  email:string|null
}

function getRandomcolor(){
  return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const router=useRouter();
  const [notes,setNotes]=useState<Array<noteType>>();
  const [userData,setUserData]=useState<userData>();

  const handleAddNote=async()=>{
    const newnote={
      title:"New note",
      content:"Click to Edit",
      "user-email":await getEmail(),
      color:getRandomcolor()
    }
    await supabase.from('notes-noink').insert(newnote);
    if(userData?.email){
      const newDbNote= await getEmailNotes(userData.email);
      newDbNote?setNotes([...newDbNote]):null;
      router.refresh();
    };
  }
  const handleDeleteNote=async(id:number)=>{
    await supabase.from('notes-noink').delete().eq("id",id);
  }
  const handleUpdateNote=async(
      {
        title,
        content,
        id,
        color
      }:{
        title:string,
        content:string,
        id:number,
        color:string
      }
    )=>{
    await supabase.from('notes-noink').update({title,content}).eq("id",id);
  }
  const handleColorChange=async(color:string,id:number)=>{
    await supabase.from("notes-noink").update({color}).eq("id",id);
  }
  
  const handleSignOut=()=>{
    window.location.replace("/login")
  }
  const getEmailNotes=async(email:string):Promise<Array<noteType>|null>=>{
    const enotes=await supabase.from('notes-noink').select("*").eq("user-email",email);
    if (enotes.data){
      return enotes.data;
    }
    return null;
  }

  const getEmail=async():Promise<string|null>=>{
    const {data,error}= await supabase.auth.getSession();
    const email=data.session?.user?.email?data.session.user.email:null;
    return email;
  }

  const setUserState=async()=>{
    const email=await getEmail();
    setUserData({
      email:email
    })
  }
  const setNoteState=async()=>{
    const email=userData?.email;
    const note:Array<noteType>|null=await getEmailNotes(email!);
    if (note){setNotes(note)}
  }
  function sortFun(noteArray:Array<noteType>){

  }
  const getUser=async()=>{
    const {data,error}= await supabase.auth.getSession();
    const enote=await getEmailNotes((await getEmail())!)
    
    setCards(enote!);
  }
  function getPreview(content:string){
    let msg;
    if(content.length>50){
      msg=content.substring(0,47)+"...";
    }
    else{
      msg=content;
    }
    return msg;
  }
  const setCards=(noteArr:Array<noteType>)=>{
    const notediv=createRoot(document.getElementById("notediv")!)
    if(noteArr)notediv.render(noteArr.map((n)=>{
      return <Card
        title={n.title}
        preview={getPreview(n.content)}
        id={n.id}
        key={n.id}
        deleteFunc={handleDeleteNote}
        color={n.color}
        colorChoices={colors}
        selectColorFunc={handleColorChange}
        />}
    ))
  }
  const setUp=async()=>{
    setUserState();
    setNoteState();
    getUser();
  };
  useEffect(()=>{
    setUp();
  },[])
 
  return (
    <div>
      <NavBar username={userData?.email} addnote={handleAddNote}/>
      <div id="notediv" className=''>
      </div>
    </div>
  );
}
