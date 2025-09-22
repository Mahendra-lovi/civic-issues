import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  FileText,
  Activity,
  MapPin,
  Brain,
  Zap,
  Shield
} from 'lucide-react';

// Mock data
const mockIssues = [
  { id: 1, category: 'Road Maintenance', location: 'Main St & 5th Ave', priority: 'High', status: 'Open', date: '2024-01-15' },
  { id: 2, category: 'Streetlight', location: 'Park Avenue', priority: 'Medium', status: 'In Progress', date: '2024-01-14' },
  { id: 3, category: 'Water Issue', location: 'Oak Street', priority: 'High', status: 'Resolved', date: '2024-01-13' },
  { id: 4, category: 'Trash Collection', location: 'Elm Street', priority: 'Low', status: 'Open', date: '2024-01-12' },
  { id: 5, category: 'Noise Complaint', location: 'Cedar Ave', priority: 'Medium', status: 'In Progress', date: '2024-01-11' }
];

const chartData = {
  departmentStats: [
    { name: 'Public Works', issues: 45, resolved: 32 },
    { name: 'Sanitation', issues: 32, resolved: 28 },
    { name: 'Transportation', issues: 28, resolved: 18 },
    { name: 'Utilities', issues: 38, resolved: 31 }
  ],
  categoryDistribution: [
    { name: 'Roads', value: 35, color: '#3b82f6' },
    { name: 'Utilities', value: 25, color: '#10b981' },
    { name: 'Sanitation', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 20, color: '#ef4444' }
  ],
  trendData: [
    { month: 'Jan', reported: 120, resolved: 95 },
    { month: 'Feb', reported: 135, resolved: 110 },
    { month: 'Mar', reported: 145, resolved: 125 },
    { month: 'Apr', reported: 128, resolved: 118 },
    { month: 'May', reported: 155, resolved: 140 },
    { month: 'Jun', reported: 142, resolved: 135 }
  ]
};

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

export default function Dashboard() {
  const stats = {
    totalReports: mockIssues.length,
    openReports: mockIssues.filter(i => i.status === 'Open').length,
    inProgressReports: mockIssues.filter(i => i.status === 'In Progress').length,
    resolvedReports: mockIssues.filter(i => i.status === 'Resolved').length,
    avgResolutionTime: 32,
    urgentIssues: mockIssues.filter(i => i.priority === 'High').length,
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, delay = 0 }) => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
    >
      <motion.div variants={cardHoverVariants}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{ background: `linear-gradient(135deg, ${color.split(' ')[1]}, ${color.split(' ')[3]})` }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <motion.p 
                  className="text-sm font-medium text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: delay + 0.2 }}
                >
                  {title}
                </motion.p>
                <motion.p 
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {value}
                </motion.p>
                {trend && (
                  <motion.div 
                    className={`flex items-center text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: delay + 0.4 }}
                  >
                    <motion.div
                      animate={{ rotate: trend === 'up' ? [0, 5, 0] : [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    </motion.div>
                    {trendValue}
                  </motion.div>
                )}
              </div>
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Icon className="w-8 h-8 text-white filter drop-shadow-sm" />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <motion.div 
        className="p-4 sm:p-6 space-y-6"
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
            Civic Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Real-time insights for better city management
          </motion.p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            icon={FileText}
            trend="up"
            trendValue="+12% from last month"
            color="from-blue-500 to-blue-700"
            delay={0}
          />
          <StatCard
            title="Open Issues"
            value={stats.openReports}
            icon={AlertTriangle}
            trend="down"
            trendValue="-8% from last week"
            color="from-orange-500 to-red-600"
            delay={0.1}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressReports}
            icon={Activity}
            trend="up"
            trendValue="+5% from yesterday"
            color="from-purple-500 to-purple-700"
            delay={0.2}
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedReports}
            icon={CheckCircle}
            trend="up"
            trendValue="+18% from last month"
            color="from-emerald-500 to-emerald-700"
            delay={0.3}
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          {[
            { icon: Clock, title: "Avg. Resolution Time", value: `${stats.avgResolutionTime}h`, color: "from-cyan-500 to-blue-600" },
            { icon: AlertTriangle, title: "Urgent Issues", value: stats.urgentIssues, color: "from-red-500 to-red-700", textColor: "text-red-600" },
            { icon: Users, title: "Active Staff", value: 24, color: "from-indigo-500 to-purple-600" }
          ].map((item, index) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <motion.div 
                    className="flex items-center space-x-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.title}</p>
                      <motion.p 
                        className={`text-2xl font-bold ${item.textColor || 'text-gray-900 dark:text-white'}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, type: 'spring', stiffness: 200 }}
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

        {/* Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          {/* Department Issues Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <BarChart className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Issues by Department
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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

          {/* Category Distribution Pie Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <PieChart className="w-5 h-5 text-purple-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Issues by Category
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trend Line Chart */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Monthly Trends
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="reported" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interactive Map Placeholder */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Issues Heatmap
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <motion.div 
                  className="h-[250px] bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-800/30 dark:to-indigo-800/30 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-700"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold">Interactive Map</p>
                    <p className="text-sm text-indigo-500 dark:text-indigo-300">Geographic distribution of issues</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Brain className="w-6 h-6 text-purple-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Insights & Predictions
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
                    <Zap className="w-3 h-3 mr-1" />
                    BETA
                  </Badge>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Predicted Issues",
                    items: [
                      { title: "Pothole season approaching", desc: "Expected 40% increase in road issues", icon: AlertTriangle, color: "text-orange-600" },
                      { title: "Drainage system overload", desc: "Rain season prep recommended", icon: Shield, color: "text-blue-600" }
                    ]
                  },
                  {
                    title: "Risk Assessment",
                    items: [
                      { title: "Public Works backlog risk", desc: "Consider additional resources", icon: AlertTriangle, color: "text-amber-600" },
                      { title: "Sanitation on track", desc: "Performance within targets", icon: CheckCircle, color: "text-emerald-600" }
                    ]
                  },
                  {
                    title: "Optimization",
                    items: [
                      { title: "Route optimization", desc: "Can reduce response time by 15%", icon: TrendingUp, color: "text-green-600" },
                      { title: "Staff reallocation", desc: "Move 2 staff to high-demand areas", icon: Users, color: "text-purple-600" }
                    ]
                  }
                ].map((section, sectionIndex) => (
                  <motion.div 
                    key={section.title}
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.2 }}
                  >
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg">{section.title}</h4>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <motion.div 
                          key={item.title}
                          className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                          whileHover={{ scale: 1.02, x: 5 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (sectionIndex * 0.2) + (itemIndex * 0.1) + 0.3 }}
                        >
                          <div className="flex items-start space-x-3">
                            <motion.div
                              whileHover={{ rotate: 180, scale: 1.2 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <item.icon className={`w-5 h-5 ${item.color} mt-0.5`} />
                            </motion.div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Issues */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Recent Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockIssues.slice(0, 5).map((issue, index) => (
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
                          } shadow-lg`}
                        >
                          {issue.priority}
                        </Badge>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{issue.category}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.location}</p>
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
                          } shadow-lg`}
                        >
                          {issue.status}
                        </Badge>
                      </motion.div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{issue.date}</p>
                    </div>
                  </motion.div>
                ))}
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
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
            whileHover={{
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
              rotate: 360
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}