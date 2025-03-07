# Task Manager Application

A full-stack task management application built with React and Node.js, featuring user authentication, task organization, and calendar integration.

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access control (Admin/User)
  - JWT-based authentication

- **Task Management**
  - Create, read, update, and delete tasks
  - Task prioritization (High, Medium, Low)
  - Due date assignment
  - Task completion tracking
  - Task filtering (All, Active, Completed, Overdue)
  - Task sorting (Due Date, Priority)

- **Calendar View**
  - Visual representation of tasks
  - Color-coded by priority and status
  - Month, week, and day views
  - Task details modal on click

- **Comments System**
  - Add comments to tasks
  - Real-time comment updates
  - User attribution for comments

- **Admin Features**
  - View all users' tasks
  - Manage user accounts
  - Task statistics dashboard

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- React Big Calendar for calendar view
- JWT decode for authentication

### Backend
- Node.js
- Express.js
- MySQL database
- JSON Web Tokens (JWT)
- bcrypt.js for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/edadic/TaskManager.git
cd TaskManager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy .env.example to .env
- Update the variables with your MySQL credentials and JWT secret

4. Initialize the database:
- Create a MySQL database named 'task_manager'
- The tables will be automatically created when you start the server

5. Start the development servers:
Start the backend server:
```bash
npm run server
```
Start the frontend server:
```bash
npm start
```
The application will be available at http://localhost:3000

## Project Structure

TaskManager/
├── server/                 # Backend server code
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── context/          # Auth context
│   └── App.js            # Main app component
└── public/               # Static files

## API Endpoints
### Authentication
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
### Tasks
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- PUT /api/tasks/:id/complete - Toggle task completion
- DELETE /api/tasks/:id - Delete task
### Comments
- GET /api/comments/task/:taskId - Get task comments
- POST /api/comments - Add comment
### Users
- GET /api/users - Get all users (admin only)
- PUT /api/users/profile - Update user profile