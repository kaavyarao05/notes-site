"use client";
import React, { useState, useRef } from "react";
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
      Link.configure({ openOnClick: true,autolink: true,})
    ],
    content: "<p>Enter text....</p>",
  });

  if (!editor) {
    return <p>Loading editor....</p>;
  }

  return (
    <main className="p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">My Note-Taking App</h1>

      {/* Flex container for text editor and drawing area */}
      <div className="flex flex-col md:flex-row gap-6 overflow-hidden">
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


//copy paste
            editorProps: {
              handlePaste(view, event) {
                const items = event.clipboardData?.items;
                if (items) {
                  for (const item of items) {
                    if (item.type.startsWith("image/")) {
                      const file = item.getAsFile();
                      const reader = new FileReader();
                      reader.onload = () => {
                        const base64 = reader.result;
                        view.dispatch(
                          view.state.tr.insert(view.state.selection.from, 
                          view.state.schema.nodes.image.create({ src: base64 }))
                        );
                      };
                      reader.readAsDataURL(file);
                      return true;
                    }
                  }
                }
                return false;
              },
            },