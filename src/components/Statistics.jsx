import React from 'react';

const Statistics = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => new Date(task.due_date) < new Date() && !task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'high').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-gray-500 text-sm">Total Tasks</h3>
        <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-gray-500 text-sm">Completed</h3>
        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-gray-500 text-sm">Overdue</h3>
        <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-gray-500 text-sm">High Priority</h3>
        <p className="text-3xl font-bold text-orange-600">{stats.highPriority}</p>
      </div>
    </div>
  );
};

export default Statistics;