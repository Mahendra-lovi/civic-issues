import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Clock,
  User,
  MapPin,
  Settings,
  Filter,
  Zap,
  Target,
  Activity,
  Sparkles,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'urgent' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionRequired?: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -3,
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

const notificationVariants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    x: 50, 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'High Priority Issue Reported',
      message: 'Water leak reported at Center Plaza. Immediate attention required.',
      time: '2 minutes ago',
      read: false,
      actionRequired: true
    },
    {
      id: '2',
      type: 'success',
      title: 'Task Completed',
      message: 'Mike Wilson completed pothole repair on Main St & 5th Ave.',
      time: '15 minutes ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Overdue Task Alert',
      message: 'Street light repair in Oak Park is 24 hours overdue.',
      time: '1 hour ago',
      read: false,
      actionRequired: true
    },
    {
      id: '4',
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'The system will be under maintenance tonight from 2 AM to 4 AM.',
      time: '2 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'success',
      title: 'New Staff Member Added',
      message: 'Welcome Jessica Martinez to the Public Works department.',
      time: '3 hours ago',
      read: true
    },
    {
      id: '6',
      type: 'warning',
      title: 'Department Workload Alert',
      message: 'Sanitation department has exceeded 80% capacity.',
      time: '4 hours ago',
      read: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.read).length;

  const getNotificationIcon = (type: string) => {
    const iconProps = "w-5 h-5";
    switch (type) {
      case 'urgent':
        return <AlertTriangle className={`${iconProps} text-red-600`} />;
      case 'success':
        return <CheckCircle2 className={`${iconProps} text-green-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconProps} text-orange-600`} />;
      case 'info':
        return <Info className={`${iconProps} text-blue-600`} />;
      default:
        return <Bell className={`${iconProps} text-gray-500`} />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const baseClasses = "font-semibold shadow-lg border-0 px-3 py-1";
    switch (type) {
      case 'urgent':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`}>
          <Zap className="w-3 h-3 mr-1" />
          Urgent
        </Badge>;
      case 'success':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600`}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Success
        </Badge>;
      case 'warning':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          Warning
        </Badge>;
      case 'info':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600`}>
          <Info className="w-3 h-3 mr-1" />
          Info
        </Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.read;
      case 'urgent':
        return notification.type === 'urgent';
      case 'action':
        return notification.actionRequired && !notification.read;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <motion.div 
        className="p-4 sm:p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="flex justify-center items-center space-x-4 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <BellRing className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2"
            animate={{ 
              background: [
                'linear-gradient(to right, #3b82f6, #8b5cf6, #1e40af)',
                'linear-gradient(to right, #8b5cf6, #1e40af, #3b82f6)',
                'linear-gradient(to right, #1e40af, #3b82f6, #8b5cf6)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Notifications
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Stay updated with system alerts and important updates
          </motion.p>
        </motion.div>

        {/* Control Bar */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Settings className="w-5 h-5 text-indigo-600" />
            </motion.div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notification Center</span>
            {unreadCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                  {unreadCount} new
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                variant="outline" 
                onClick={markAllAsRead} 
                disabled={unreadCount === 0}
                className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                variant="outline"
                className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300 shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              icon: Bell, 
              label: 'Total Notifications', 
              value: notifications.length, 
              color: 'from-blue-500 to-blue-700', 
              bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
            },
            { 
              icon: AlertTriangle, 
              label: 'Unread', 
              value: unreadCount, 
              color: 'from-purple-500 to-indigo-600', 
              bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
              textColor: 'text-purple-600'
            },
            { 
              icon: Zap, 
              label: 'Urgent', 
              value: urgentCount, 
              color: 'from-red-500 to-red-700', 
              bgColor: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
              textColor: 'text-red-600'
            },
            { 
              icon: Target, 
              label: 'Action Required', 
              value: notifications.filter(n => n.actionRequired && !n.read).length, 
              color: 'from-orange-500 to-yellow-500', 
              bgColor: 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20',
              textColor: 'text-orange-600'
            }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            >
              <motion.div variants={cardHoverVariants}>
                <Card className={`overflow-hidden bg-gradient-to-br ${stat.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <motion.div 
                      className="flex items-center space-x-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                        <motion.p 
                          className={`text-3xl font-bold ${stat.textColor || 'text-gray-900 dark:text-white'}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'urgent', label: 'Urgent', count: urgentCount },
            { key: 'action', label: 'Action Required', count: notifications.filter(n => n.actionRequired && !n.read).length }
          ].map((filter) => (
            <motion.div
              key={filter.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                variant={activeFilter === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
                className={activeFilter === filter.key 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg border-0'
                  : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300'
                }
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Notifications List */}
        <motion.div className="space-y-4" variants={containerVariants}>
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                layoutId={notification.id}
              >
                <Card className={`transition-all duration-300 overflow-hidden border-0 shadow-xl hover:shadow-2xl ${
                  !notification.read 
                    ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 ring-2 ring-blue-200 dark:ring-blue-700' 
                    : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.2, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {getNotificationIcon(notification.type)}
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className={`font-bold text-lg ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.title}
                            </h3>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {getNotificationBadge(notification.type)}
                            </motion.div>
                            {notification.actionRequired && (
                              <motion.div
                                animate={{ pulse: !notification.read ? [1, 1.05, 1] : 1 }}
                                transition={{ duration: 2, repeat: !notification.read ? Infinity : 0 }}
                              >
                                <Badge className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 font-semibold">
                                  <Activity className="w-3 h-3 mr-1" />
                                  Action Required
                                </Badge>
                              </motion.div>
                            )}
                            {!notification.read && (
                              <motion.div 
                                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 h-auto hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-4 ${!notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'} bg-white/60 dark:bg-gray-700/60 p-3 rounded-lg border-l-4 ${
                          notification.type === 'urgent' ? 'border-red-500' :
                          notification.type === 'success' ? 'border-green-500' :
                          notification.type === 'warning' ? 'border-orange-500' :
                          'border-blue-500'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3">
                          {notification.actionRequired && !notification.read && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg border-0">
                                <Zap className="w-4 h-4 mr-2" />
                                Take Action
                              </Button>
                            </motion.div>
                          )}
                          {!notification.read && (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 transition-all duration-300"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Read
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Card className="overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-xl">
              <CardContent className="p-16 text-center">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Bell className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">No notifications found</h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {activeFilter === 'all' 
                    ? "You're all caught up! Check back later for updates." 
                    : `No ${activeFilter} notifications at the moment.`
                  }
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
            whileHover={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
              rotate: 360
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BellRing className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}