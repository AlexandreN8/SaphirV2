// components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Pas besoin de props children ici
export const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar /> 
      
      <main className="flex-1">
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
};