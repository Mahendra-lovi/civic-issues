import React from 'react';
import { Bell, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopNavProps {
  title: string;
  onRefresh?: () => void;
  sidebarCollapsed?: boolean;
}

export default function TopNav({ title, onRefresh, sidebarCollapsed = false }: TopNavProps) {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New urgent issue reported', time: '2 min ago', type: 'urgent' },
    { id: 2, title: 'Task completed by Mike Wilson', time: '15 min ago', type: 'success' },
    { id: 3, title: 'System maintenance scheduled', time: '1 hour ago', type: 'info' },
  ];

  const handleViewAllNotifications = () => {
    navigate ('/notifications');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-4 shadow-sm">
      <div className="px-6 flex items-center justify-between mx-auto max-w-none">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
          <p className="text-sm text-blue-700/80">
            City of Springfield • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
            <Input
              placeholder="Search issues..."
              className="pl-10 w-64 bg-white border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 transition-all duration-200 rounded-lg shadow-sm"
            />
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-blue-600 text-white text-xs hover:scale-110 transition-transform duration-200 shadow">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 border border-blue-200 shadow-lg rounded-xl overflow-hidden"
            >
              <div className="p-3 border-b border-blue-200 bg-blue-50">
                <h3 className="font-semibold text-blue-900">Notifications</h3>
                <p className="text-sm text-blue-700">You have 3 unread notifications</p>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className="p-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 group"
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`w-2 h-2 rounded-full mt-2 transition-colors duration-200 ${
                      notification.type === 'urgent' ? 'bg-red-500 group-hover:bg-red-600' :
                      notification.type === 'success' ? 'bg-green-500 group-hover:bg-green-600' : 'bg-blue-500 group-hover:bg-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 group-hover:text-blue-800 transition-colors duration-200">
                        {notification.title}
                      </p>
                      <p className="text-xs text-blue-600">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <div className="p-3 border-t border-blue-200 bg-blue-50">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200 rounded-lg"
                  onClick={handleViewAllNotifications}
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}