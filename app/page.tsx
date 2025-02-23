"use client"
import { useEffect } from 'react';
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

async function getNotes(){
    return await supabase.from('notes').select().neq('email',"");
}

function getRandomColour(){
  return(colors[0])
  //return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const router=useRouter();
  const handleAddNote=async()=>{
    const newnote={
      title:"New note",
      content:"Click to Edit",
    }
    await supabase.from('notes').insert(newnote);
  }
  
  const handleSignOut=()=>{
    window.location.replace("/login")
  }
  const getEmailNotes=async(email:string)=>{
    const enotes=await supabase.from('notes-noink').select("*").eq("user-email",email);
    if (enotes.data){
      return enotes.data;
    }
    return null;
  }
  const setCards=(noteArr:Array<
    {
      id:number,
      created_at:string,
      title:string,
      content:string,
      "user-email":string
    }>)=>{
    const notediv=createRoot(document.getElementById("notediv")!)
    notediv.render(noteArr.map((n)=>
      <Card title={n.title} preview={
        n.content.length>100?n.content.substring(0,100)+"...":
        n.content
      } id={n.id} key={n.id} color={colors[0]}/>
    ))
  }
  const getUser=async()=>{
    const {data,error}= await supabase.auth.getSession();
    const userComponent=document.getElementById("username")
    if(userComponent&&data.session?.user.email){
      const email=data.session.user.email;
      userComponent.innerHTML=email;
      const enote=await getEmailNotes(email)
      setCards(enote!);
    }
      
  }
  useEffect(()=>{getUser()},[])
 
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
