"use client"
import { useState } from 'react';
import Card from '@/app/1components/Card';

const colors=[
  "#ffcdd6",
  "#9fffdf",
  "#a7e9ff"
]

var id=1;
export function getId(){
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
export function setNotes(note){
    notesDat=[...notesDat,note];
    return notesDat
}

export function getNotes(){
    return notesDat;
}

function getRandomColour(){
  return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const noteDat= getNotes();
  const [notes,setNoteComponent]=useState(noteDat);

  const noteComponents=notes.map((note)=>
    <Card
      title={note.title}
      preview={note.preview}
      color={note.color}
      key={note.id}
      id={note.id}
      />
  )
  const handleAddNote=()=>{
    setNoteComponent(setNotes(
      {
        title:"new",
        preview:"Click to Edit",
        color:getRandomColour(),
        id:getId()
      }
    ));
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
