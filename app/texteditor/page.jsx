"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { Mark } from '@tiptap/core';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Custom mark extension for word definitions
const DefinitionMark = Mark.create({
  name: 'definition',
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  addAttributes() {
    return {
      definitionText: {
        default: null,
      },
      definitionId: {
        default: () => `def-${Math.random().toString(36).substr(2, 9)}`,
      }
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'span[data-definition]',
        getAttrs: element => ({
          definitionText: element.getAttribute('data-definition'),
          definitionId: element.getAttribute('data-definition-id') || `def-${Math.random().toString(36).substr(2, 9)}`,
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['span', {
      ...this.options.HTMLAttributes,
      'data-definition': HTMLAttributes.definitionText,
      'data-definition-id': HTMLAttributes.definitionId,
      'class': 'definition-word'
    }, 0];
  },
  
  addCommands() {
    return {
      setDefinition: (definitionText) => ({ commands }) => {
        return commands.setMark(this.name, { 
          definitionText,
          definitionId: `def-${Math.random().toString(36).substr(2, 9)}`
        });
      },
      unsetDefinition: () => ({ commands }) => {
        return commands.unsetMark(this.name);
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
  const [activeTooltips, setActiveTooltips] = useState({});
  const [allDefinitions, setAllDefinitions] = useState({});
  const tooltipInstancesRef = useRef({});

  // Load saved definitions from localStorage
  useEffect(() => {
    try {
      const savedDefinitions = localStorage.getItem('wordDefinitions');
      if (savedDefinitions) {
        setAllDefinitions(JSON.parse(savedDefinitions));
      }
    } catch (error) {
      console.error("Error loading definitions:", error);
    }
  }, []);

  // Save definitions to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('wordDefinitions', JSON.stringify(allDefinitions));
    } catch (error) {
      console.error("Error saving definitions:", error);
    }
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
      DefinitionMark,
    ],
    content: "<p>Enter text.... Select any word, right-click, and add a definition to try it out!</p>",
    onUpdate: ({ editor }) => {
      // This ensures definitions are properly displayed after content changes
      setTimeout(() => setupDefinitionTooltips(), 100);
    },
  });

  const setupDefinitionTooltips = () => {
    if (!editor) return;
    
    // Clean up existing tooltips first
    Object.values(tooltipInstancesRef.current).forEach(instance => {
      if (instance && instance.destroy) {
        instance.destroy();
      }
    });
    tooltipInstancesRef.current = {};
    
    // Find all elements with data-definition attribute
    const definitionElements = editor.view.dom.querySelectorAll('span[data-definition]');
    
    // Create new tooltip instances
    definitionElements.forEach(element => {
      const definition = element.getAttribute('data-definition');
      const definitionId = element.getAttribute('data-definition-id') || 
                          `def-${Math.random().toString(36).substr(2, 9)}`;
      
      // Ensure the element has a definition ID attribute
      if (!element.hasAttribute('data-definition-id')) {
        element.setAttribute('data-definition-id', definitionId);
      }
      
      const instance = tippy(element, {
        content: definition,
        arrow: true,
        placement: 'top',
        theme: 'light-border',
        trigger: 'manual', // Manual trigger for click toggle behavior
        interactive: true,
        appendTo: document.body,
      });
      
      tooltipInstancesRef.current[definitionId] = instance;
      
      // Add visual indicator that this word has a definition
      element.style.borderBottom = '1px dotted #3b82f6';
      element.style.cursor = 'pointer';
      
      // Add click event to toggle tooltip visibility
      const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = activeTooltips[definitionId];
        
        // Hide all tooltips first
        Object.entries(tooltipInstancesRef.current).forEach(([id, tip]) => {
          tip.hide();
        });
        
        // Update active tooltips state
        const newActiveTooltips = {};
        
        // If this tooltip wasn't visible, show it (toggle behavior)
        if (!isVisible) {
          instance.show();
          newActiveTooltips[definitionId] = true;
        }
        
        setActiveTooltips(newActiveTooltips);
        
        return false;
      };
      
      // Remove any existing click handler to prevent duplication
      element.removeEventListener('click', clickHandler);
      element.addEventListener('click', clickHandler);
    });
  };

  useEffect(() => {
    if (editor) {
      // Set up context menu for definition creation
      const editorElement = editor.view.dom;
      
      const contextMenuHandler = (e) => {
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
      };
      
      // Remove any existing context menu handler to prevent duplication
      editorElement.removeEventListener('contextmenu', contextMenuHandler);
      editorElement.addEventListener('contextmenu', contextMenuHandler);
      
      // Initial setup of definition tooltips
      setupDefinitionTooltips();
      
      return () => {
        // Clean up event listener
        editorElement.removeEventListener('contextmenu', contextMenuHandler);
      };
    }
  }, [editor]);

  const addDefinitionToWord = () => {
    if (!editor || !selectedText || !definitionInput) return;
    
    // Save to our state object for persistence
    setAllDefinitions(prev => ({
      ...prev,
      [selectedText]: definitionInput
    }));
    
    // Apply to editor content with a unique ID
    const definitionId = `def-${Math.random().toString(36).substr(2, 9)}`;
    editor
      .chain()
      .focus()
      .setDefinition(definitionInput)
      .run();
    
    // Reset and close modal
    setDefinitionInput('');
    setDefinitionModalOpen(false);
    
    // Refresh tooltips
    setTimeout(setupDefinitionTooltips, 100);
  };

  const insertDefinedWord = (word, definition) => {
    if (!editor) return;
    
    const definitionId = `def-${Math.random().toString(36).substr(2, 9)}`;
    
    editor.chain().focus().insertContent({
      type: 'text',
      marks: [{ 
        type: 'definition', 
        attrs: { 
          definitionText: definition,
          definitionId
        } 
      }],
      text: word
    }).run();
    
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
        <div className="flex-1 flex flex-col border p-4 rounded-md shadow-md overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Text Editor</h2>

          <div className="mb-2 space-x-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 border rounded font-bold ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              B
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 border rounded italic ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 border rounded underline ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            >
              U
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 border rounded ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
            >
              S
            </button>

            <select
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              className="px-2 py-1 border rounded"
              value={editor.getAttributes('textStyle').fontFamily || ''}
            >
              <option value="">Default</option>
              <option value="Arial">Arial</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>

            {/* Font Color */}
            <input
              type="color"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              value={editor.getAttributes('textStyle').color || '#000000'}
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

            {/* Add definition button */}
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
                  setDefinitionPosition({ 
                    x: window.innerWidth / 2, 
                    y: window.innerHeight / 2 - 100 
                  });
                  setDefinitionModalOpen(true);
                } else {
                  alert("Please select text first to add a definition");
                }
              }}
              className="px-2 py-1 border rounded bg-blue-100"
              title="Add a hidden definition to selected text
                     How to use:  Select any text, then right-click or use the 'Add Definition' button to create a definition. Click on defined words (with dotted underline) to show/hide definitions."
            >
              📝 Add Definition
            </button>
          </div>
          <div className="flex-1 overflow-auto border rounded p-2">
            <EditorContent editor={editor} className="prose max-w-none min-h-64" />
          </div>
          
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
              transform: 'translate(-50%, -50%)',
              maxWidth: '500px'
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
                <div className="flex justify-between mt-2">
                  <button 
                    onClick={() => insertDefinedWord(word, definition)}
                    className="text-xs text-blue-500"
                  >
                    Insert
                  </button>
                  <button 
                    onClick={() => {
                      const newDefinitions = {...allDefinitions};
                      delete newDefinitions[word];
                      setAllDefinitions(newDefinitions);
                    }}
                    className="text-xs text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for definition words */}
      <style jsx global>{`
        .definition-word {
          border-bottom: 1px dotted #3b82f6;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .definition-word:hover {
          background-color: rgba(59, 130, 246, 0.1);
        }
        .tippy-box {
          max-width: 300px !important;
        }
      `}</style>
    </main>
  );
}