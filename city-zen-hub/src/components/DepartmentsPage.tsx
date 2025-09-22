import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Building2, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Award,
  Activity,
  Zap,
  Star,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';

// Mock data
const mockDepartments = [
  { 
    id: 1, 
    name: 'Public Works', 
    totalIssues: 45, 
    openIssues: 12, 
    avgResolutionTime: 28 
  },
  { 
    id: 2, 
    name: 'Utilities', 
    totalIssues: 32, 
    openIssues: 8, 
    avgResolutionTime: 24 
  },
  { 
    id: 3, 
    name: 'Sanitation', 
    totalIssues: 28, 
    openIssues: 6, 
    avgResolutionTime: 18 
  },
  { 
    id: 4, 
    name: 'Code Enforcement', 
    totalIssues: 22, 
    openIssues: 4, 
    avgResolutionTime: 36 
  },
  { 
    id: 5, 
    name: 'Parks & Recreation', 
    totalIssues: 18, 
    openIssues: 3, 
    avgResolutionTime: 32 
  },
  { 
    id: 6, 
    name: 'Transportation', 
    totalIssues: 15, 
    openIssues: 2, 
    avgResolutionTime: 20 
  }
];

const mockIssues = [
  { id: 1, category: 'Road Maintenance', department: 'Public Works', location: 'Main St & 5th Ave', priority: 'High', status: 'Open', date: '2024-01-15' },
  { id: 2, category: 'Streetlight', department: 'Utilities', location: 'Park Avenue', priority: 'Medium', status: 'In Progress', date: '2024-01-14' },
  { id: 3, category: 'Water Issue', department: 'Utilities', location: 'Oak Street', priority: 'High', status: 'Resolved', date: '2024-01-13' },
  { id: 4, category: 'Trash Collection', department: 'Sanitation', location: 'Elm Street', priority: 'Low', status: 'Open', date: '2024-01-12' },
  { id: 5, category: 'Pothole', department: 'Public Works', location: 'Cedar Ave', priority: 'Medium', status: 'In Progress', date: '2024-01-11' }
];

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
    y: -5,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

export default function DepartmentsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('Public Works');

  const departmentIssues = mockIssues.filter(issue => issue.department === selectedDepartment);
  const departmentData = mockDepartments.find(dept => dept.name === selectedDepartment);

  const wardData = [
    { ward: 'Ward 1', issues: 12, resolved: 8 },
    { ward: 'Ward 2', issues: 8, resolved: 6 },
    { ward: 'Ward 3', issues: 15, resolved: 10 },
    { ward: 'Ward 4', issues: 10, resolved: 9 },
    { ward: 'Ward 5', issues: 6, resolved: 5 },
  ];

  const getDepartmentIcon = (deptName) => {
    switch (deptName) {
      case 'Public Works': return Building2;
      case 'Utilities': return Zap;
      case 'Sanitation': return Activity;
      case 'Code Enforcement': return Target;
      case 'Parks & Recreation': return Award;
      case 'Transportation': return Activity;
      default: return Building2;
    }
  };

  const getDepartmentColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-emerald-500 to-emerald-700',
      'from-purple-500 to-purple-700',
      'from-orange-500 to-orange-700',
      'from-teal-500 to-teal-700',
      'from-pink-500 to-pink-700'
    ];
    return colors[index % colors.length];
  };

  const DepartmentCard = ({ department, index }) => {
    const IconComponent = getDepartmentIcon(department.name);
    const colorClass = getDepartmentColor(index);
    const isSelected = selectedDepartment === department.name;
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover="hover"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      >
        <motion.div variants={cardHoverVariants}>
          <Card className={`relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5`} />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <IconComponent className="w-7 h-7 text-white filter drop-shadow-sm" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {department.name}
                    </motion.h3>
                    <motion.p 
                      className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {department.totalIssues} total issues
                    </motion.p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(department.name)}
                    className={isSelected ? 
                      'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg border-0' : 
                      'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 font-semibold transition-all duration-300'
                    }
                  >
                    {isSelected ? 'Selected' : 'View Details'}
                  </Button>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-red-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, type: 'spring', stiffness: 200 }}
                  >
                    {department.openIssues}
                  </motion.p>
                  <p className="text-xs text-red-500 font-medium">Open</p>
                </motion.div>
                <motion.div 
                  className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring', stiffness: 200 }}
                  >
                    {department.totalIssues - department.openIssues}
                  </motion.p>
                  <p className="text-xs text-green-500 font-medium">Resolved</p>
                </motion.div>
                <motion.div 
                  className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, type: 'spring', stiffness: 200 }}
                  >
                    {department.avgResolutionTime}h
                  </motion.p>
                  <p className="text-xs text-blue-500 font-medium">Avg Time</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

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
            Departments
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Monitor department performance and track issues
          </motion.p>
        </motion.div>

        {/* Department Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {mockDepartments.map((department, index) => (
            <DepartmentCard key={department.id} department={department} index={index} />
          ))}
        </motion.div>

        {/* Department Selector */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Building2 className="w-6 h-6 text-indigo-600" />
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Department Details: {selectedDepartment}
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-64 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-300 shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Department Stats */}
        <AnimatePresence mode="wait">
          {departmentData && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              key={selectedDepartment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {[
                { icon: AlertTriangle, title: "Total Issues", value: departmentData.totalIssues, color: "from-blue-500 to-blue-700", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
                { icon: AlertTriangle, title: "Open Issues", value: departmentData.openIssues, color: "from-red-500 to-red-700", bgColor: "bg-red-50 dark:bg-red-900/20", textColor: "text-red-600" },
                { icon: CheckCircle, title: "Resolved", value: departmentData.totalIssues - departmentData.openIssues, color: "from-green-500 to-green-700", bgColor: "bg-green-50 dark:bg-green-900/20", textColor: "text-green-600" },
                { icon: Clock, title: "Avg. Resolution", value: `${departmentData.avgResolutionTime}h`, color: "from-orange-500 to-orange-700", bgColor: "bg-orange-50 dark:bg-orange-900/20" }
              ].map((item, index) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                >
                  <Card className={`overflow-hidden ${item.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                    <CardContent className="p-6">
                      <motion.div 
                        className="flex items-center space-x-4"
                        whileHover={{ x: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <motion.div 
                          className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <item.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{item.title}</p>
                          <motion.p 
                            className={`text-3xl font-bold ${item.textColor || 'text-gray-900 dark:text-white'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                          >
                            {item.value}
                          </motion.p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ward/Zone Analysis & Performance Metrics */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Ward Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <BarChart className="w-5 h-5 text-cyan-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Issues by Ward/Zone
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wardData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="issues" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Performance Metrics
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { title: "Resolution Rate", subtitle: "Last 30 days", value: "85%", change: "+5% from last month", color: "text-green-600", bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20", icon: TrendingUp },
                    { title: "Staff Efficiency", subtitle: "Issues per staff member", value: "12.5", change: "Within target range", color: "text-blue-600", bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20", icon: Users },
                    { title: "Citizen Satisfaction", subtitle: "Based on follow-up surveys", value: "4.2/5", change: "+0.3 from last quarter", color: "text-purple-600", bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20", icon: Star }
                  ].map((metric, index) => (
                    <motion.div 
                      key={metric.title}
                      className={`flex items-center justify-between p-4 bg-gradient-to-r ${metric.bgColor} rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{metric.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{metric.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          className={`text-2xl font-bold ${metric.color}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                        >
                          {metric.value}
                        </motion.p>
                        <p className={`text-sm ${metric.color}`}>{metric.change}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Issues for Department */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Issues - {selectedDepartment}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {departmentIssues.slice(0, 5).map((issue, index) => (
                    <motion.div 
                      key={issue.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Badge 
                            className={`${
                              issue.priority === 'High' 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0' 
                                : issue.priority === 'Medium' 
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0' 
                                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
                            } shadow-lg font-semibold`}
                          >
                            {issue.priority}
                          </Badge>
                        </motion.div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{issue.category}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{issue.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Badge 
                            className={`${
                              issue.status === 'Open' 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0' 
                                : issue.status === 'In Progress' 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0'
                            } shadow-lg font-semibold`}
                          >
                            {issue.status}
                          </Badge>
                        </motion.div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">{issue.date}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {departmentIssues.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-500 font-medium text-lg">No recent issues</p>
                    <p className="text-sm text-gray-400 mt-2">This department has no recent activity</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
            className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
            whileHover={{
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)',
              rotate: 360
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Building2 className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}