"use client"
import { useState, useEffect } from 'react';
import Card from '@/app/1components/Card';
import {getNotes,getId} from "@/app/data.js"

const colors=[
  "#ffcdd6",
  "#9fffdf",
  "#a7e9ff"
]

function getRandomColour(){
  return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const noteDat= getNotes();
  const [notes,setNotes]=useState(noteDat);

  const noteComponents=notes.map((note)=>
    <Card
      title={note.title}
      preview={note.preview}
      color={note.color}
      key={note.id}
      id={note.id}
      />
  )
  console.log(notes);
  const handleAddNote=()=>{
    setNotes([...notes,
      {
        title:"new",
        preview:"Click to Edit",
        color:getRandomColour(),
        id:getId()
      }
    ]);
    console.log(notes);
  }
  
  const handleSignOut=()=>{
    window.location.replace("/login")
  }
  
  return (
    <div>
      <div>
        <button onClick={handleSignOut}>TestUser</button>
        <button onClick={handleAddNote}>+</button>
      </div>
      <div>
        {noteComponents}
      </div>
    </div>
  );
}
