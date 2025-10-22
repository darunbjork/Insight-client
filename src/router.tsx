import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile'; // New import
import { ProtectedRoute } from './components/auth/ProtectedRoute'; // New import

const Router: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* PROTECTED ROUTES */}
      {/* All routes needing authentication are wrapped */}
      
      <Route path="/" element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* POST DETAIL and other future routes will go here */}
      <Route path="/posts/:id" element={
        <ProtectedRoute>
          {/* PostDetail component (Day 8) */}
          <div className="text-center p-10">Post Detail Page (Protected)</div>
        </ProtectedRoute>
      } />
      
      {/* CATCH ALL */}
      <Route path="*" element={
        <div className="text-center p-10">
          <h1 className="text-4xl font-bold">404 - Not Found</h1>
          <p className="text-lg mt-2">The page you're looking for doesn't exist.</p>
        </div>
      } />
    </Routes>
  );
};

export default Router;