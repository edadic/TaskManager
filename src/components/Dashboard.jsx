import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      <TaskList 
        tasks={tasks}
        onComplete={toggleComplete}
        isAdmin={false}
      />
    </div>
  );
};

export default Dashboard;