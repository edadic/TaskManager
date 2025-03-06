import React from 'react';

const TaskItem = ({ task, onComplete, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-4 border border-gray-200 rounded-md p-4">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onComplete(task.id)}
        className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-gray-600 mt-1">{task.description}</p>
        <p className="text-sm text-gray-500 mt-2">Due: {formatDate(task.dueDate)}</p>
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 p-2"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;