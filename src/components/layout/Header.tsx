import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import './Header.scss'; // Import the SCSS file

export const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          ThoughtStream
        </Link>
        
        {isLoading ? (
          <Spinner />
        ) : user ? (
          <nav className="header-nav">
            <Link to="/" className="header-link">
              Feed
            </Link>
            <Link to="/profile" className="header-username profile-link">
              Profile
            </Link>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </nav>
        ) : (
          <nav className="header-nav">
            <Link to="/login" className="header-link">
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