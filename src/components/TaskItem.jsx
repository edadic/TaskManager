import React from 'react';

const TaskItem = ({ task, onComplete, onDelete, isAdmin }) => {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            className="h-5 w-5"
          />
          <div>
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex gap-3 text-sm text-gray-600">
              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              <span className={`${
                task.priority === 'high' ? 'text-red-600' :
                task.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
        
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;