import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { TaskList } from './components/tasks/TaskList';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="app">
        <nav>
          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <div>
              <a href="/login">Login</a> | <a href="/register">Register</a>
            </div>
          )}
        </nav>

        <Routes>
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/tasks" replace />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/tasks" replace />
              ) : (
                <RegisterForm onRegister={handleLogin} />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              token ? <TaskList /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
