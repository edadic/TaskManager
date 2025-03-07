import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import Statistics from './Statistics';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
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
      setError('Error fetching tasks');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch('http://localhost:5001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      fetchTasks();
    } catch (error) {
      setError('Error creating task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks();
    } catch (error) {
      setError('Error deleting task');
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
      setError('Error updating task');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Statistics tasks={tasks} />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Create Task</h2>
          <TaskForm onAddTask={addTask} users={users} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">All Tasks</h2>
          <TaskList 
            tasks={tasks}
            onComplete={toggleComplete}
            onDelete={deleteTask}
            isAdmin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;