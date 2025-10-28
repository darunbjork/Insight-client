import React, { type ReactNode } from 'react';
import { Header } from './Header';
import './Layout.scss'; // Import the SCSS file

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout wrapper. 
 * Provides consistent header/footer/structure for all main pages.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};