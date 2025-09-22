import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  Brain, 
  Clock, 
  MapPin, 
  Star,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity,
  Target,
  Award,
  Sparkles,
  Send,
  Bot,
  UserCheck,
  Timer,
  Calendar
} from 'lucide-react';

// Mock data
const mockIssues = [
  { 
    id: 1, 
    category: 'Road Maintenance', 
    location: 'Main St & 5th Ave', 
    priority: 'High', 
    status: 'Open', 
    date: '2024-01-15',
    description: 'Large pothole causing traffic issues and potential vehicle damage',
    assignedTo: null
  },
  { 
    id: 2, 
    category: 'Streetlight', 
    location: 'Park Avenue', 
    priority: 'Medium', 
    status: 'In Progress', 
    date: '2024-01-14',
    description: 'Street light flickering and causing safety concerns',
    assignedTo: 'Carlos Rodriguez'
  },
  { 
    id: 3, 
    category: 'Water Issue', 
    location: 'Oak Street', 
    priority: 'High', 
    status: 'In Progress', 
    date: '2024-01-13',
    description: 'Water main break causing flooding in residential area',
    assignedTo: 'Amy Chen'
  },
  { 
    id: 4, 
    category: 'Trash Collection', 
    location: 'Elm Street', 
    priority: 'Low', 
    status: 'Open', 
    date: '2024-01-12',
    description: 'Missed garbage pickup for the third consecutive week',
    assignedTo: null
  },
  { 
    id: 5, 
    category: 'Park Maintenance', 
    location: 'Cedar Ave Park', 
    priority: 'Medium', 
    status: 'Open', 
    date: '2024-01-11',
    description: 'Playground equipment needs repair and safety inspection',
    assignedTo: null
  }
];

const mockStaff = [
  { id: 1, name: 'Mike Wilson', department: 'Public Works' },
  { id: 2, name: 'Carlos Rodriguez', department: 'Utilities' },
  { id: 3, name: 'Sarah Brown', department: 'Sanitation' },
  { id: 4, name: 'Amy Chen', department: 'Water Department' },
  { id: 5, name: 'Tom Garcia', department: 'Parks & Recreation' }
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

export default function TasksPage() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [notes, setNotes] = useState('');

  const unassignedIssues = mockIssues.filter(issue => !issue.assignedTo && issue.status === 'Open');
  const assignedIssues = mockIssues.filter(issue => issue.assignedTo);

  const getAIRecommendation = (issue) => {
    const recommendations = {
      'Road Maintenance': {
        staff: 'Mike Wilson',
        reason: 'Experienced with road repairs, available in the area',
        confidence: 95
      },
      'Streetlight': {
        staff: 'Carlos Rodriguez',
        reason: 'Electrical specialist, high success rate with lighting issues',
        confidence: 92
      },
      'Trash Collection': {
        staff: 'Sarah Brown',
        reason: 'Sanitation supervisor, handles route optimization',
        confidence: 88
      },
      'Water Issue': {
        staff: 'Amy Chen',
        reason: 'Water system engineer, emergency response certified',
        confidence: 96
      },
      'Park Maintenance': {
        staff: 'Tom Garcia',
        reason: 'Parks specialist, available this week',
        confidence: 85
      }
    };

    return recommendations[issue.category] || {
      staff: 'Available Staff Member',
      reason: 'General availability and skill match',
      confidence: 75
    };
  };

  const handleAssignment = () => {
    if (!selectedIssue || !selectedStaff) return;
    setAssignmentDialogOpen(false);
    setSelectedIssue(null);
    setSelectedStaff('');
    setNotes('');
  };

  const AssignmentDialog = () => {
    const recommendation = selectedIssue ? getAIRecommendation(selectedIssue) : null;

    return (
      <AnimatePresence>
        {assignmentDialogOpen && (
          <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
            <DialogContent className="max-w-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 border-0 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <DialogHeader className="pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <DialogTitle className="flex items-center space-x-2 text-2xl font-bold">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <UserPlus className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Assign Task
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </motion.div>
                    </DialogTitle>
                  </motion.div>
                </DialogHeader>

                {selectedIssue && (
                  <div className="space-y-6">
                    {/* Issue Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <motion.div
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <span className="text-white font-bold text-sm">{selectedIssue.id}</span>
                              </motion.div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Issue #{selectedIssue.id}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedIssue.category} - {selectedIssue.location}</p>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Badge 
                                className={`${
                                  selectedIssue.priority === 'High' 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0' 
                                    : selectedIssue.priority === 'Medium'
                                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
                                      : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
                                } shadow-lg font-semibold px-3 py-1`}
                              >
                                {selectedIssue.priority} Priority
                              </Badge>
                            </motion.div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                            {selectedIssue.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* AI Recommendation */}
                    {recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                              >
                                <Brain className="w-6 h-6 text-purple-600" />
                              </motion.div>
                              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                AI Recommendation
                              </span>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
                                  <Bot className="w-3 h-3 mr-1" />
                                  {recommendation.confidence}% Match
                                </Badge>
                              </motion.div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <motion.div 
                              className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200/50 dark:border-purple-700/50"
                              whileHover={{ scale: 1.02, x: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <div className="flex items-center space-x-4">
                                <motion.div
                                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                                  whileHover={{ rotate: 180, scale: 1.1 }}
                                  transition={{ type: 'spring', stiffness: 200 }}
                                >
                                  <UserCheck className="w-6 h-6 text-white" />
                                </motion.div>
                                <div>
                                  <p className="font-bold text-gray-800 dark:text-gray-200 text-lg">{recommendation.staff}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.reason}</p>
                                </div>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <Button
                                  onClick={() => setSelectedStaff(recommendation.staff)}
                                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-lg border-0 transition-all duration-300"
                                >
                                  <Zap className="w-4 h-4 mr-2" />
                                  Use AI Suggestion
                                </Button>
                              </motion.div>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Manual Assignment */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                              Manual Assignment
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="staff-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Assign to Staff Member
                            </Label>
                            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                              <SelectTrigger className="mt-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg">
                                <SelectValue placeholder="Select staff member" />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                                {mockStaff.map((staff) => (
                                  <SelectItem key={staff.id} value={staff.name}>
                                    <div className="flex items-center space-x-2">
                                      <span>{staff.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {staff.department}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Assignment Notes (Optional)
                            </Label>
                            <Textarea
                              id="notes"
                              placeholder="Add any special instructions or notes for the assigned staff member..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="mt-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div 
                      className="flex justify-end space-x-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => setAssignmentDialogOpen(false)}
                          className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 transition-all duration-300"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Button 
                          onClick={handleAssignment} 
                          disabled={!selectedStaff}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg border-0 transition-all duration-300"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Assign Task
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
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
            Task Assignment
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage and assign issues to staff members with AI assistance
          </motion.p>
          <motion.div 
            className="flex justify-center items-center space-x-4 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg px-4 py-2 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {unassignedIssues.length} Unassigned
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg px-4 py-2 text-sm">
                <Users className="w-4 h-4 mr-1" />
                {assignedIssues.length} Assigned
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Assignment Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              icon: AlertTriangle, 
              label: 'Unassigned', 
              value: unassignedIssues.length, 
              color: 'from-orange-500 to-red-600', 
              bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
              textColor: 'text-orange-600'
            },
            { 
              icon: Activity, 
              label: 'Active Tasks', 
              value: assignedIssues.filter(i => i.status === 'In Progress').length, 
              color: 'from-blue-500 to-purple-600', 
              bgColor: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20',
              textColor: 'text-blue-600'
            },
            { 
              icon: CheckCircle, 
              label: 'Completed Today', 
              value: 8, 
              color: 'from-green-500 to-emerald-600', 
              bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
              textColor: 'text-green-600'
            },
            { 
              icon: Star, 
              label: 'Avg Rating', 
              value: '4.3', 
              color: 'from-purple-500 to-pink-600', 
              bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
              textColor: 'text-purple-600'
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
                          className={`text-3xl font-bold ${stat.textColor}`}
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

        {/* Unassigned Issues */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Unassigned Issues
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                    <Timer className="w-3 h-3 mr-1" />
                    {unassignedIssues.length}
                  </Badge>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {unassignedIssues.map((issue, index) => {
                    const recommendation = getAIRecommendation(issue);
                    return (
                      <motion.div 
                        key={issue.id}
                        className="p-5 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
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
                              <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{issue.category}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">#{issue.id}</span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>{issue.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>{issue.date}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 bg-white/60 dark:bg-gray-700/60 p-3 rounded-lg">
                              {issue.description}
                            </p>
                            
                            {/* AI Recommendation Inline */}
                            <motion.div 
                              className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <motion.div
                                  animate={{ rotate: [0, 360] }}
                                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                >
                                  <Brain className="w-4 h-4 text-purple-600" />
                                </motion.div>
                                <span className="font-semibold text-purple-700 dark:text-purple-300">AI Suggests:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">{recommendation.staff}</span>
                                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-xs shadow-sm">
                                  {recommendation.confidence}% match
                                </Badge>
                              </div>
                              <p className="text-xs text-purple-600 dark:text-purple-400">{recommendation.reason}</p>
                            </motion.div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Button
                              onClick={() => {
                                setSelectedIssue(issue);
                                setAssignmentDialogOpen(true);
                              }}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg border-0 transition-all duration-300 px-6 py-2"
                            >
                              <UserPlus className="w-4 h-4 mr-2" />
                              Assign Task
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {unassignedIssues.length === 0 && (
                  <motion.div 
                    className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  >
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-green-600 font-bold text-xl mb-2">All Caught Up!</p>
                    <p className="text-sm text-green-500">All issues are currently assigned to staff members</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assigned Issues */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Currently Assigned
                </span>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                    <Activity className="w-3 h-3 mr-1" />
                    {assignedIssues.length}
                  </Badge>
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {assignedIssues.map((issue, index) => (
                    <motion.div 
                      key={issue.id}
                      className="p-5 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900/20 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
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
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Badge 
                                className={`${
                                  issue.status === 'In Progress' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0' 
                                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
                                } shadow-lg font-semibold`}
                              >
                                {issue.status}
                              </Badge>
                            </motion.div>
                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{issue.category}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">#{issue.id}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-blue-700 dark:text-blue-300">{issue.assignedTo}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span>{issue.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{issue.date}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-700/60 p-3 rounded-lg">
                            {issue.description}
                          </p>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Button 
                            variant="outline" 
                            className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 transition-all duration-300 shadow-lg px-4 py-2"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Reassign
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AssignmentDialog />

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
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
            whileHover={{
              boxShadow: '0 20px 40px rgba(147, 51, 234, 0.4)',
              rotate: 360
            }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <UserPlus className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}