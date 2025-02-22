"use client"
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header({ username }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white text-[#C2185B] p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link href="/">No-Ink</Link>
        </h1>

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
          <Link href="/" className="text-lg font-semibold text-[#C2185B]">
            Home
          </Link>
          <Link href="/about" className="text-lg font-semibold text-[#C2185B]">
            New note
          </Link>
          <Link href="/contact" className="text-lg font-semibold text-[#C2185B]">
            Checklist
          </Link>
          <Link href="/contact" className="text-lg font-semibold text-[#C2185B]">
            Canvas
          </Link>
        </nav>
      </div>
    </header>
  );
}
