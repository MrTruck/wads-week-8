// app/page.tsx
"use client"

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase"; // Your firebase config
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { addTodo, getTodos, deleteTodo, toggleTodo } from "./actions";

export default function TodoApp() {
  const [user, setUser] = useState<any>(null);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Listen for Auth Changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) fetchTodos(u.uid);
    });
    return () => unsubscribe();
  }, []);

  async function fetchTodos(uid: string) {
    const data = await getTodos(uid);
    setTodos(data as any);
  }

  const handleLogin = () => signInWithPopup(auth, new GoogleAuthProvider());

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-blue-600">TaskMaster</h1>
        <button 
          onClick={handleLogin}
          className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition flex items-center gap-2"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <button onClick={() => signOut(auth)} className="text-sm text-red-500 hover:underline">Logout</button>
      </header>

      <form action={() => { addTodo(user.uid, input); setInput(""); }} className="flex gap-2 mb-8">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Add Task
        </button>
      </form>

      <div className="space-y-4">
        {todos.map((todo: any) => (
          <div key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id, todo.completed)}
                className="w-5 h-5 accent-blue-600"
              />
              <span className={todo.completed ? "line-through text-gray-400" : "text-gray-700 font-medium"}>
                {todo.task}
              </span>
            </div>
            <button onClick={() => deleteTodo(todo.id)} className="text-gray-300 hover:text-red-500 transition">
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}