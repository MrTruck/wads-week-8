// components/TodoList.tsx
import { deleteTodo } from "@/app/actions";

export default function TodoList({ todos }) {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow border">
          <span className={todo.completed ? "line-through text-gray-400" : ""}>
            {todo.task}
          </span>
          <button 
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}