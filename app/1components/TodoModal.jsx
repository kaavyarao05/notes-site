"use client";
import { useState, useEffect } from "react";
import { Trash2, CheckCircle, Circle, X } from "lucide-react";

export default function TodoModal({ isOpen, onClose }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  // Delete a task
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Close modal when clicking outside
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  mr-20">
      <div className="bg-yellow-200 p-6 rounded-md shadow-lg w-80 ">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">To-Do List</h2>
          <button onClick={onClose}>
            <X size={20} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Input and Add Button */}
        <div className="flex mb-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded-l-md"
          />
          <button
            onClick={addTask}
            className="px-3 bg-pink-600 text-white rounded-r-md"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul>
          {tasks.map((t, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 my-2 rounded-md"
            >
              <button onClick={() => toggleTask(index)} className="mr-2">
                {t.completed ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-gray-500" />
                )}
              </button>
              <span className={`flex-1 ${t.completed ? "line-through text-gray-500" : ""}`}>
                {t.text}
              </span>
              <button onClick={() => deleteTask(index)}>
                <Trash2 size={20} className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
