"use client";
import { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Clipboard, Download, Eraser, Palette, Redo, Trash2, Undo } from "lucide-react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#000000");

  // Copy to Clipboard
  const copyCanvasToClipboard = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = await canvasRef.current.exportImage("png");
        const blob = await (await fetch(dataUrl)).blob();
        const clipboardItem = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([clipboardItem]);
        alert("Copied to clipboard!");
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
  };

  // Download as Image
  const saveCanvasAsImage = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = await canvasRef.current.exportImage("png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "drawing.png";
        a.click();
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  return (
    <div className="flex-1 p-4 rounded-md  ">
      <h2 className="text-lg font-bold mb-2">Drawing Canvas</h2>
      <div className="mb-2 space-x-2 relative flex">
        <div className="relative flex items-center space-x-2">
          <Palette size={15} className="text-gray-700" />
          <input
            type="color"
            value={brushColor}
            onChange={(e) => {
              setBrushColor(e.target.value);
              canvasRef.current.eraseMode(false);
              canvasRef.current.brushColor = e.target.value;
            }}
            className="w-7 h-7 border rounded-full cursor-pointer"
          />
        </div>

        <button onClick={() => canvasRef.current.undo()} className="p-1 bg-gray-500 text-white rounded-md">
          <Undo size={15} />
        </button>

        <button onClick={() => canvasRef.current.redo()} className="p-1 bg-gray-500 text-white rounded-md">
          <Redo size={15} />
        </button>

        <button onClick={() => canvasRef.current.eraseMode(true)} className="p-1 bg-yellow-500 text-black rounded-md">
          <Eraser size={15} />
        </button>

        <button onClick={() => canvasRef.current.clearCanvas()} className="p-1 bg-red-500 text-white rounded-md">
          <Trash2 size={15} />
        </button>

        <button onClick={copyCanvasToClipboard} className="p-1 bg-blue-500 text-white rounded-md">
          <Clipboard size={15} />
        </button>

        <button onClick={saveCanvasAsImage} className="p-1 bg-green-500 text-white rounded-md">
          <Download size={15} />
        </button>
      </div>

      <ReactSketchCanvas ref={canvasRef} strokeWidth={4} strokeColor={brushColor} className="w-full h-full border" />
    </div>
  );
}
