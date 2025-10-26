import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute'; // New import

import { PostDetail } from './pages/PostDetail';

import { PublicProfile } from './pages/PublicProfile'; // New import
import { Layout } from './components/layout/Layout';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* PROTECTED ROUTES */}
      {/* ... existing protected routes ... */}
      
      <Route path="/posts/:id" element={
        <ProtectedRoute>
          <PostDetail />
        </ProtectedRoute>
      } />
      
      {/* NEW: Public Profile Route (Does NOT require protection) */}
      <Route path="/users/:id" element={
        <Layout> 
          <PublicProfile /> 
        </Layout>
      } />
      
      {/* CATCH ALL */}
      {/* ... 404 route ... */}
    </Routes>
  );
};

export default Router;