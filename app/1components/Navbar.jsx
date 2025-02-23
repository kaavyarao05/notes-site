"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import TodoModal from "@/app/1components/TodoModal";

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

export default function Header({ username,addnote,random_color }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen,setIsModalOpen]=useState(false);
  return (
    <header className="bg-white text-[#C2185B] p-2 shadow-md mb-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex">
          <img src="/logo.png" alt="logo" className="h-10 w-10 mr-3"/>
          <h1 className="text-2xl pt-1 font-bold items-center">
            <Link href="/">No-Ink</Link>
          </h1>
        </div>
       

        {/* Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 transition-colors duration-1000"
        >
          <Menu size={40} className="text-[#C2185B]" />
        </button>
      </div>

      {/* Right-side Sliding Menu */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-[#FFFACD] shadow-lg transition-transform duration-300 p-20 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 p-2"
        >
          <X size={30} className="text-[#C2185B]" />
        </button>

        {/* Menu Items */}
        <nav className="mt-10 flex flex-col space-y-4">
          <a href="/" className="text-lg font-semibold text-[#C2185B] ml-1.5">
            Home
          </a>
          <button href="/about" className="text-lg font-semibold text-[#C2185B]">
            New note
          </button>
          <button onClick={()=>setIsModalOpen(true)}
           className="text-lg font-semibold text-[#C2185B]">
            Checklist
          </button>
          <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
