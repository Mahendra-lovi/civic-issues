import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download, 
  FileText, 
  Calendar,
  Filter,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Activity,
  Zap,
  Star,
  Sparkles,
  TrendingDown
} from 'lucide-react';

// Mock data
const chartData = {
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

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 Days');

  const resolutionData = [
    { range: '0-6h', count: 25, color: '#10B981' },
    { range: '6-12h', count: 40, color: '#3B82F6' },
    { range: '12-24h', count: 35, color: '#F59E0B' },
    { range: '24-48h', count: 20, color: '#EF4444' },
    { range: '48h+', count: 15, color: '#8B5CF6' },
  ];

  const performanceData = [
    { department: 'Public Works', efficiency: 85, satisfaction: 4.2, avgTime: 36 },
    { department: 'Sanitation', efficiency: 92, satisfaction: 4.5, avgTime: 24 },
    { department: 'Water Dept', efficiency: 78, satisfaction: 3.8, avgTime: 48 },
    { department: 'Parks & Rec', efficiency: 88, satisfaction: 4.3, avgTime: 30 },
    { department: 'Lighting', efficiency: 95, satisfaction: 4.6, avgTime: 18 },
  ];

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
            Analytics Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Comprehensive insights and performance metrics
          </motion.p>
        </motion.div>

        {/* Control Bar */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <div className="flex flex-wrap items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300 shadow-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Date Range</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button 
                variant="outline"
                className="flex items-center space-x-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>{selectedTimeRange}</span>
              </Button>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: Download, label: 'Export PDF', color: 'from-blue-500 to-purple-600' },
              { icon: FileText, label: 'Export CSV', variant: 'outline' },
              { icon: FileText, label: 'Export Excel', variant: 'outline' }
            ].map((button, index) => (
              <motion.div
                key={button.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button 
                  className={button.variant === 'outline' 
                    ? 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300 shadow-lg'
                    : `bg-gradient-to-r ${button.color} hover:shadow-lg text-white font-semibold shadow-lg border-0 transition-all duration-300`
                  }
                  variant={button.variant || 'default'}
                >
                  <button.icon className="w-4 h-4 mr-2" />
                  {button.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              value: '94%', 
              label: 'Overall Resolution Rate', 
              badge: '+2% from last month', 
              badgeType: 'success', 
              icon: Target, 
              color: 'from-green-500 to-emerald-700',
              bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
            },
            { 
              value: '28h', 
              label: 'Avg Resolution Time', 
              badge: '-4h improvement', 
              badgeType: 'success', 
              icon: Clock, 
              color: 'from-blue-500 to-blue-700',
              bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
            },
            { 
              value: '12', 
              label: 'Overdue Issues', 
              badge: 'Needs attention', 
              badgeType: 'warning', 
              icon: AlertTriangle, 
              color: 'from-orange-500 to-red-600',
              bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
            },
            { 
              value: '4.3/5', 
              label: 'Citizen Satisfaction', 
              badge: '+0.2 improvement', 
              badgeType: 'success', 
              icon: Star, 
              color: 'from-purple-500 to-pink-600',
              bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
            }
          ].map((metric, index) => (
            <motion.div 
              key={metric.label}
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
            >
              <motion.div variants={cardHoverVariants}>
                <Card className={`overflow-hidden bg-gradient-to-br ${metric.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        animate={metric.badgeType === 'success' ? { rotate: [0, 5, -5, 0] } : { scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {metric.badgeType === 'success' && <TrendingUp className="w-5 h-5 text-green-500" />}
                        {metric.badgeType === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                      </motion.div>
                    </div>
                    <div className="text-center">
                      <motion.p 
                        className="text-3xl font-bold mb-2"
                        style={{ color: metric.color.includes('green') ? '#059669' : metric.color.includes('blue') ? '#1d4ed8' : metric.color.includes('orange') ? '#dc2626' : '#7c3aed' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                      >
                        {metric.value}
                      </motion.p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">{metric.label}</p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <Badge 
                          className={`${
                            metric.badgeType === 'success' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0'
                          } shadow-lg font-semibold`}
                        >
                          {metric.badge}
                        </Badge>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Department Performance */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Department Performance
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="department" tick={{ fontSize: 12 }} />
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
                    <Bar dataKey="efficiency" fill="url(#blueGradient)" name="Efficiency %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgTime" fill="url(#purpleGradient)" name="Avg Time (h)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Issue Categories */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <PieChartIcon className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Issue Categories Distribution
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
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

          {/* Trend Analysis */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Monthly Trend Analysis
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
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
                      stroke="#f59e0b" 
                      strokeWidth={3} 
                      name="Reported"
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      name="Resolved"
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resolution Times */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-5 h-5 text-purple-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Resolution Time Distribution
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="count" fill="url(#rainbowGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="rainbowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Detailed Analysis */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Performance Insights */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="w-6 h-6 text-indigo-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Performance Insights
                  </span>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      title: 'Top Performing Department', 
                      desc: 'Street Lighting department has achieved 95% efficiency with an average resolution time of 18 hours.',
                      icon: Award,
                      color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                      iconColor: 'text-green-600',
                      borderColor: 'border-green-500'
                    },
                    { 
                      title: 'Areas for Improvement', 
                      desc: 'Water Department showing longer resolution times. Consider resource reallocation or additional training.',
                      icon: AlertTriangle,
                      color: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
                      iconColor: 'text-orange-600',
                      borderColor: 'border-orange-500'
                    },
                    { 
                      title: 'Positive Trends', 
                      desc: 'Overall citizen satisfaction has improved by 0.2 points this quarter, with significant gains in response time.',
                      icon: TrendingUp,
                      color: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
                      iconColor: 'text-blue-600',
                      borderColor: 'border-blue-500'
                    }
                  ].map((insight, index) => (
                    <motion.div 
                      key={insight.title}
                      className={`p-4 bg-gradient-to-r ${insight.color} rounded-xl border-l-4 ${insight.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-start space-x-3">
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <insight.icon className={`w-5 h-5 ${insight.iconColor} mt-0.5`} />
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">{insight.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{insight.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Quick Stats
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { label: 'Issues This Month', value: '156', icon: Activity },
                    { label: 'Resolved This Month', value: '145', icon: CheckCircle2, highlight: true },
                    { label: 'Active Staff', value: '24', icon: Users },
                    { label: 'Departments', value: '5', icon: Target },
                    { label: 'Avg Response Time', value: '2.5h', icon: Clock }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      className={`flex justify-between items-center p-3 rounded-xl transition-all duration-300 ${
                        stat.highlight 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700' 
                          : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: -5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <stat.icon className={`w-4 h-4 ${
                            stat.highlight ? 'text-green-600' : 'text-gray-500'
                          }`} />
                        </motion.div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
                      </div>
                      <motion.span 
                        className={`font-bold text-lg ${
                          stat.highlight ? 'text-green-600' : 'text-gray-800 dark:text-gray-200'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
            className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
            whileHover={{
              boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)',
              rotate: 360
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <BarChart3 className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}