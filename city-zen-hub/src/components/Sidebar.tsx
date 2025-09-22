import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Building2, 
  BarChart3, 
  Users, 
  Settings, 
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  UserCog,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed: initialCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  useEffect(() => {
    setIsCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Task Assignment', href: '/tasks', icon: Users },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const adminNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return Shield;
      case 'Supervisor': return UserCog;
      case 'Staff': return Briefcase;
      default: return Users;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-blue-600 text-white';
      case 'Supervisor': return 'bg-blue-500 text-white';
      case 'Staff': return 'bg-blue-400 text-white';
      default: return 'bg-blue-300 text-white';
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const RoleIcon = getRoleIcon(user?.role || '');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  const handleNavigationClick = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    return (
      <>
        {/* Mobile Hamburger Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {/* Mobile Sidebar Drawer */}
        <div 
          className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={toggleMobileMenu}
          />

          {/* Sidebar Content */}
          <div className="absolute left-0 top-0 h-full w-80 bg-card border-r border-border flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-foreground">Civic Dashboard</h1>
                <p className="text-sm text-muted-foreground">City Management</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-lg">
                    <RoleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.department}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={handleNavigationClick}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-muted-foreground hover:text-foreground hover:bg-blue-50'
                      }`}
                    >
                      <item.icon className="w-6 h-6 mr-3 transition-transform duration-200 hover:scale-110" />
                      <span>{item.name}</span>
                      {item.name === 'Notifications' && (
                        <Badge className="ml-auto bg-blue-600 text-white hover:scale-110 transition-transform duration-200">
                          3
                        </Badge>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {user?.role === 'Admin' && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-1">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Administration
                    </div>
                    {adminNavigation.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          onClick={handleNavigationClick}
                          className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            active
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-muted-foreground hover:text-foreground hover:bg-blue-50'
                          }`}
                        >
                          <item.icon className="w-6 h-6 mr-3 transition-transform duration-200 hover:scale-110" />
                          <span>{item.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              )}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-6 h-6 mr-3" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:block">
          <DesktopSidebar 
            isCollapsed={isCollapsed} 
            onToggle={onToggle} 
            user={user}
            navigation={navigation}
            adminNavigation={adminNavigation}
            getRoleIcon={getRoleIcon}
            getRoleBadgeColor={getRoleBadgeColor}
            isActive={isActive}
            logout={logout}
            RoleIcon={RoleIcon}
          />
        </div>
      </>
    );
  }

  return (
    <DesktopSidebar 
      isCollapsed={isCollapsed} 
      onToggle={onToggle} 
      user={user}
      navigation={navigation}
      adminNavigation={adminNavigation}
      getRoleIcon={getRoleIcon}
      getRoleBadgeColor={getRoleBadgeColor}
      isActive={isActive}
      logout={logout}
      RoleIcon={RoleIcon}
    />
  );
}

// Simplified Desktop Sidebar Component
function DesktopSidebar({ 
  isCollapsed, 
  onToggle, 
  user,
  navigation,
  adminNavigation,
  getRoleIcon,
  getRoleBadgeColor,
  isActive,
  logout,
  RoleIcon
}: any) {
  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} 
        bg-white
        border-r border-border 
        h-screen flex flex-col 
        transition-all duration-300 ease-in-out 
        overflow-hidden 
        shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-foreground">Civic Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-1">City Management System</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-foreground" />
            ) : (
              <X className="w-5 h-5 text-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-border transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${
              isCollapsed ? 'mx-auto' : ''
            }`}>
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.name}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`text-xs ${getRoleBadgeColor(user.role)} hover:scale-105 transition-transform duration-200`}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{user.department}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-blue-50'
                  }`}
              >
                <item.icon 
                  className={`${
                    isCollapsed ? 'w-6 h-6 mx-auto' : 'w-5 h-5 mr-3'
                  } transition-transform duration-200 hover:scale-110`} 
                />
                {!isCollapsed && (
                  <span className="flex-1">{item.name}</span>
                )}
                {!isCollapsed && item.name === 'Notifications' && (
                  <Badge className="ml-auto bg-blue-600 text-white hover:scale-110 transition-transform duration-200">
                    3
                  </Badge>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-card border text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {user?.role === 'Admin' && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className={`px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${
                isCollapsed ? 'text-center' : ''
              }`}>
                {isCollapsed ? '⚙️' : 'Administration'}
              </div>
              {adminNavigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-blue-50'
                      }`}
                  >
                    <item.icon 
                      className={`${
                        isCollapsed ? 'w-6 h-6 mx-auto' : 'w-5 h-5 mr-3'
                      } transition-transform duration-200 hover:scale-110`} 
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                    {isCollapsed && (
                      <span className="absolute left-full ml-3 px-2 py-1 rounded-md bg-card border text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={`w-full justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg ${
            !isCollapsed ? 'justify-start' : ''
          }`}
        >
          <LogOut className={`${isCollapsed ? 'w-6 h-6 mx-auto' : 'w-5 h-5 mr-3'} transition-transform duration-200 hover:scale-110`} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}