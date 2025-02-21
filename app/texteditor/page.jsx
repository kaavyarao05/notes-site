"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import { ReactSketchCanvas } from "react-sketch-canvas";
import Link from "@tiptap/extension-link";

export default function TextEditor() {
  const [brushColor, setBrushColor] = useState("black"); // Brush color for drawing
  const canvasRef = React.createRef(); // Reference for drawing canvas

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      Strike,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({ types: ["textStyle"] }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      })
    ],
    content: "<p>Enter text....</p>",
  });

  if (!editor) {
    return <p>Loading editor....</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Note-Taking App</h1>

      {/* Flex container for text editor and drawing area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ✍️ Text Editor */}
        <div className="flex-1 border p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Text Editor</h2>

          <div className="mb-2 space-x-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="px-2 py-1 border rounded font-bold"
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="px-2 py-1 border rounded italic"
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className="px-2 py-1 border rounded underline"
            >
              U
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="px-2 py-1 border rounded"
            >
              S
            </button>

            {/* Font Color */}
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="px-2 py-1 border rounded"
            />

            {/* Highlight Color */}
            <input
              type="color"
              onChange={(e) =>
                editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
              }
              className="px-2 py-1 border rounded"
            />

            <button
              onClick={() => {
                const linkText = prompt("Enter the text to display:");
                const url = prompt("Enter the link URL:");

                if (linkText && url) {
                  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).insertContent(linkText).run();
                }
              }}
              className="px-2 py-1 border rounded"
            >
              🔗 Add Link
            </button>



          </div>

          <EditorContent editor={editor} />
        </div>

        {/* ✏️ Drawing Area */}
        <div className="flex-1 border p-4 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Drawing Canvas</h2>

          <div className="mb-2 space-x-2">
            <button
              onClick={() => canvasRef.current.clearCanvas()}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Clear
            </button>

            <button
              onClick={() => canvasRef.current.undo()}
              className="px-3 py-1 bg-gray-500 text-white rounded-md"
            >
              Undo
            </button>

            <input
              type="color"
              value={brushColor}
              onChange={(e) => {
                setBrushColor(e.target.value);
                canvasRef.current.eraseMode(false);
                canvasRef.current.setStrokeColor(e.target.value);
              }}
              className="px-2 py-1 border rounded"
            />

            <button
              onClick={() => canvasRef.current.eraseMode(true)}
              className="px-3 py-1 bg-yellow-500 text-black rounded-md"
            >
              Eraser
            </button>
          </div>

          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={4}
            strokeColor={brushColor}
            className="w-full h-80 border"
          />
        </div>
      </div>
    </main>
  );
}
