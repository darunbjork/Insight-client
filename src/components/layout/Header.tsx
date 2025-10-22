import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ThoughtStream
        </Link>
        
        {isLoading ? (
          <Spinner />
        ) : user ? (
          <nav className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              {user.username}
            </Link>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </nav>
        ) : (
          <nav className="space-x-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};