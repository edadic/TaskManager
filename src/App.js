import './App.css';
import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([data, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}/complete`, {
        method: 'PUT',
      });
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Task Manager</h1>
        <div className="space-y-8">
          <TaskForm onAddTask={addTask} />
          <TaskList 
            tasks={tasks} 
            onDelete={deleteTask} 
            onComplete={toggleComplete} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;