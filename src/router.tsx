import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Feed } from './pages/Feed';
// Note: We'll implement ProtectedRoute on Day 4, but for now, we use public routes
// import { ProtectedRoute } from './components/auth/ProtectedRoute'; 

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* For Day 2, all routes are public. We'll wrap them in ProtectedRoute on Day 4 */}
      <Route path="/" element={<Feed />} />
      <Route path="/profile" element={
        <div className="text-center p-10">
          Profile Page - Coming Soon (Day 5)
        </div>
      } />
      
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