"use client"
import { useState } from 'react';
import Card from '@/app/1components/Card';
import Navbar from '@/app/1components/Navbar'

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

function getNotes(){
    return notesDat;
}

function getRandomColour(){
  return(colors[0])
  //return(colors[Math.floor(Math.random() * colors.length)]);
}

export default function Home() {
  const [notes,setNoteComponent]=useState(getNotes());

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
    setNoteComponent([...notes,
      {
        title:"new",
        preview:"Click to Edit",
        color:getRandomColour(),
        id:getId()
      }
    ]);
  }
  
  return (
    <div>
      <Navbar username="test" addnote={handleAddNote} random_color={getRandomColour}/>
      <div>
        {noteComponents}
      </div>
    </div>
  );
}
