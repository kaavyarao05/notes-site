import Link from 'next/link';
import {Menu} from "lucide-react";

export default function Header({username}) {
  return (
    <header className="bg-white text-[#C2185B] p-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link href="/">No-Ink</Link>
        </h1>

        {/* Navigation Links */}
        <nav className="space-x-4">
          <button href="/contact" className="hover:underline">
            <Menu size={40} />
          </button>
        </nav>
      </div>
    </header>
  );
}
