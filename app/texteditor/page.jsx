"use client";
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import { ReactSketchCanvas } from "react-sketch-canvas";
import Link from "@tiptap/extension-link";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Custom extension for word definitions
const WordDefinition = Extension.create({
  name: 'wordDefinition',
  
  addAttributes() {
    return {
      definition: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-definition]',
        getAttrs: element => ({
          definition: element.getAttribute('data-definition'),
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, 'data-definition': HTMLAttributes.definition }, 0];
  },
  
  addCommands() {
    return {
      setWordDefinition: definition => ({ chain }) => {
        return chain()
          .setMark('wordDefinition', { definition })
          .run();
      },
      unsetWordDefinition: () => ({ chain }) => {
        return chain()
          .unsetMark('wordDefinition')
          .run();
      },
    };
  },
});

export default function TextEditor() {
  const [brushColor, setBrushColor] = useState("black");
  const canvasRef = React.createRef();
  const [definitionModalOpen, setDefinitionModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [definitionInput, setDefinitionInput] = useState("");
  const [definitionPosition, setDefinitionPosition] = useState({ x: 0, y: 0 });
  const [allDefinitions, setAllDefinitions] = useState({});

  // Load saved definitions from localStorage
  useEffect(() => {
    const savedDefinitions = localStorage.getItem('wordDefinitions');
    if (savedDefinitions) {
      setAllDefinitions(JSON.parse(savedDefinitions));
    }
  }, []);

  // Save definitions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wordDefinitions', JSON.stringify(allDefinitions));
  }, [allDefinitions]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Color,
      TextStyle,
      Strike,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({ types: ["textStyle"] }),
      Link.configure({ openOnClick: true, autolink: true }),
      WordDefinition,
    ],
    content: "<p>Enter text....</p>",
    onUpdate: ({ editor }) => {
      // This ensures definitions are properly displayed after content changes
      setupDefinitionTooltips();
    },
  });

  const setupDefinitionTooltips = () => {
    if (!editor) return;
    
    // Find all elements with data-definition attribute
    const definitionElements = editor.view.dom.querySelectorAll('span[data-definition]');
    
    definitionElements.forEach(element => {
      const definition = element.getAttribute('data-definition');
      
      tippy(element, {
        content: definition,
        arrow: true,
        placement: 'top',
        theme: 'light-border',
        trigger: 'click',
        interactive: true,
        appendTo: document.body,
      });
      
      // Add visual indicator that this word has a definition
      element.style.borderBottom = '1px dotted #3b82f6';
      element.style.cursor = 'pointer';
    });
  };

  useEffect(() => {
    if (editor) {
      // Set up context menu for definition creation
      const editorElement = editor.view.dom;
      
      editorElement.addEventListener('contextmenu', (e) => {
        const selection = editor.view.state.selection;
        if (!selection.empty) {
          e.preventDefault();
          const selectedText = editor.view.state.doc.textBetween(
            selection.from,
            selection.to,
            ' '
          );
          setSelectedText(selectedText);
          setDefinitionPosition({ x: e.pageX, y: e.pageY });
          setDefinitionModalOpen(true);
        }
      });
      
      // Initial setup of definition tooltips
      setupDefinitionTooltips();
    }
  }, [editor]);

  const addDefinitionToWord = () => {
    if (!editor || !selectedText || !definitionInput) return;
    
    // Save to our state object for persistence
    setAllDefinitions(prev => ({
      ...prev,
      [selectedText]: definitionInput
    }));
    
    // Apply to editor content
    editor
      .chain()
      .focus()
      .setWordDefinition(definitionInput)
      .run();
    
    // Reset and close modal
    setDefinitionInput('');
    setDefinitionModalOpen(false);
    
    // Refresh tooltips
    setTimeout(setupDefinitionTooltips, 100);
  };

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

              {/* Other font options remain the same */}
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

            {/* New button to add definition to selected text */}
            <button
              onClick={() => {
                const selection = editor.view.state.selection;
                if (!selection.empty) {
                  const selectedText = editor.view.state.doc.textBetween(
                    selection.from,
                    selection.to,
                    ' '
                  );
                  setSelectedText(selectedText);
                  setDefinitionModalOpen(true);
                } else {
                  alert("Please select text first to add a definition");
                }
              }}
              className="px-2 py-1 border rounded bg-blue-100"
              title="Add a hidden definition to selected text"
            >
              📝 Add Definition
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

      {/* Definition Modal */}
      {definitionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div 
            className="bg-white p-4 rounded-md shadow-lg w-96"
            style={{
              position: 'absolute',
              left: `${definitionPosition.x}px`,
              top: `${definitionPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              maxWidth: '300px'
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Add Definition for "{selectedText}"</h3>
            <textarea
              value={definitionInput}
              onChange={(e) => setDefinitionInput(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
              rows="4"
              placeholder="Enter definition or notes here..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDefinitionModalOpen(false)}
                className="px-3 py-1 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addDefinitionToWord}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Save Definition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Definition List/Manager */}
      <div className="mt-6 border p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Saved Definitions</h2>
        {Object.keys(allDefinitions).length === 0 ? (
          <p className="text-gray-500">No definitions saved yet. Right-click on selected text to add definitions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(allDefinitions).map(([word, definition]) => (
              <div key={word} className="border p-2 rounded-md">
                <h3 className="font-medium text-blue-600">{word}</h3>
                <p className="text-sm">{definition}</p>
                <button 
                  onClick={() => {
                    const newDefinitions = {...allDefinitions};
                    delete newDefinitions[word];
                    setAllDefinitions(newDefinitions);
                  }}
                  className="text-xs text-red-500 mt-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}