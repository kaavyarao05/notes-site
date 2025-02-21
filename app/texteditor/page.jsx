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
import FontFamily from "@tiptap/extension-font-family";

//useEditor to create an instance of the editor
//EditorContent: wrapper
//StarterKit basic text editing utilities

export default function TextEditor() {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      Strike,
      Highlight.configure({multicolor:true}),
      FontFamily.configure({
        types:["textStyle"]
      }),
    ],
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

        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="px-2 py-1 border rounded"
        >
              <option value="">Default</option>
              <option value="Arial">Arial</option>
              <option value="Arial Narrow">Arial Narrow</option>
              <option value="Baskerville">Baskerville</option>
              <option value="Bodoni MT">Bodoni MT</option>
              <option value="Bookman">Bookman</option>
              <option value="Brush Script MT">Brush Script MT</option>
              <option value="Candara">Candara</option>
              <option value="Century Gothic">Century Gothic</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Consolas">Consolas</option>
              <option value="Copperplate">Copperplate</option>
              <option value="Courier">Courier</option>
              <option value="Courier New">Courier New</option>
              <option value="Didot">Didot</option>
              <option value="Futura">Futura</option>
              <option value="Garamond">Garamond</option>
              <option value="Geneva">Geneva</option>
              <option value="Georgia">Georgia</option>
              <option value="Gill Sans">Gill Sans</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Impact">Impact</option>
              <option value="Lato">Lato</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Lucida Handwriting">Lucida Handwriting</option>
              <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
              <option value="Monaco">Monaco</option>
              <option value="MS Sans Serif">MS Sans Serif</option>
              <option value="MS Serif">MS Serif</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Palatino Linotype">Palatino Linotype</option>
              <option value="Perpetua">Perpetua</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Roboto">Roboto</option>
              <option value="Rockwell">Rockwell</option>
              <option value="Segoe UI">Segoe UI</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Franklin Gothic Medium">Franklin Gothic Medium</option>


        </select>

        {/* Font Size Input 
        <input
          type="number"
          placeholder="Font Size"
          min="8"
          max="72"
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value + "px").run()}
          className="px-2 py-1 border rounded w-20"
        />
        */}

        <label for="fontSize">Font Size:</label>
        <select id="fontSize">
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px" selected>16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
        </select>


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

