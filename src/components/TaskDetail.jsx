import React from 'react';
import TaskComments from './TaskComments';

const TaskDetail = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <h3 className="font-semibold text-gray-700">Description</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
          
          <div className="flex gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Due Date</h3>
              <p className="text-gray-600">
                {new Date(task.due_date).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">Priority</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">Status</h3>
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {task.completed ? 'Completed' : 'Active'}
              </span>
            </div>
          </div>
        </div>

        <TaskComments taskId={task.id} />
      </div>
    </div>
  );
};

export default TaskDetail;