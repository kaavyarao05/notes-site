"use client";
import React from 'react'
import { usePathname } from 'next/navigation'


import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";


//useEditor to create an instance of the editor
//EditorContent: wrapper
//StarterKit basic text editing utilities

export default function TextEditor() {

  const editor = useEditor({
    extensions: [StarterKit,Underline,Color,TextStyle,Strike,Highlight.configure({multicolor:true}),],
    content: "<p>Enter text....</p>",
  });

  if(!editor){
    return <p>Loading editor....</p>;
  }

  return (

    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Note-Taking App</h1>
      <div className="border p-4 rounded-md shadow-md">
      <div className="mb-2 space-x-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded font-bold">
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded italic">
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded underline">
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className="px-2 py-1 border rounded">
          S
        </button>

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="px-2 py-1 border rounded"
        />

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }
          className="px-2 py-1 border rounded"
        />

        

      </div>
      <EditorContent editor={editor} />
    </div>
    </main>

    
  );
}

