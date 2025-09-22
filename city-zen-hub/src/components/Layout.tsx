import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { useLocation } from 'react-router-dom';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/reports':
        return 'Issue Reports';
      case '/departments':
        return 'Department Management';
      case '/analytics':
        return 'Analytics & Insights';
      case '/tasks':
        return 'Task Assignment';
      case '/notifications':
        return 'Notifications';
      case '/settings':
        return 'System Settings';
      default:
        return 'Civic Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          title={getPageTitle()}
          onRefresh={() => window.location.reload()}
        />
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}