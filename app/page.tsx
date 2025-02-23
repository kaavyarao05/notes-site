"use client"

import { useActionState, useEffect, useState } from 'react';
import Card from '@/app/1components/Card';
import { supabase } from './lib/supabase';
import { useRouter } from 'next/navigation';
import {createRoot} from 'react-dom/client';


const colors=[
  "#ffcdd6",
  "#9fffdf",
  "#a7e9ff"
]

let id=1
function getId(){
  return(id++);
}

type noteType=
{
  id:number,
  created_at:string,
  title:string,
  content:string,
  "user-email":string|null
}

type userData={
  email:string|null
}

var notesDat=[ //fetch instead
    {
      title:"Test Title",
      preview:"Preview",
      color:"#ffcdd6",
      id:getId()
    },
    {
      title:"Test Title",
      preview:"Preview",
      color:"#9fffdf",
      id:getId()
    },
    {
      title:"Test Title",
      preview:"Preview",
      color:"#a7e9ff",
      id:getId()
    }
]

function getRandomColour(){
  return(colors[0])
  //return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const router=useRouter();
  const [notes,setNotes]=useState<Array<noteType>>();
  const [userData,setUserData]=useState<userData>();

  console.log(notes);
  const handleAddNote=async()=>{
    const newnote={
      title:"New note",
      content:"Click to Edit",
      "user-email":await getEmail()
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
    setNoteState();
  }
  const setNoteState=async()=>{
    const email=userData?.email;
    const note:Array<noteType>|null=await getEmailNotes(email!);
    if (note){setNotes(note)}
    getUser();
  }
  const getUser=async()=>{
    const {data,error}= await supabase.auth.getSession();
    const userComponent=document.getElementById("username");
    const email=await getEmail()!
    userComponent!.innerHTML=email!;
    const enote=await getEmailNotes(email!)
    setCards(enote!);
  }
  const setCards=(noteArr:Array<noteType>)=>{
    const notediv=createRoot(document.getElementById("notediv")!)
    if(noteArr)notediv.render(noteArr.map((n)=>
      <Card
        title={n.title}
        preview={
          n.content.length>100?n.content.substring(0,100)+"...":
          n.content
        }
        id={n.id}
        key={n.id}
        deleteFunc={handleDeleteNote}
        color={colors[0]}
        />
    ))
  }
  useEffect(()=>{
    setUserState();
  },[])
 
  return (
    <div>
      <div>
        <button onClick={handleSignOut} id="username"></button>
        <button onClick={handleAddNote}>+</button>
      </div>
      <div id="notediv">
      </div>
    </div>
  );
}
