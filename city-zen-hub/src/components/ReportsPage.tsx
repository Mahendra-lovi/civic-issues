import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Eye, 
  User, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  FileText,
  Camera,
  MessageSquare,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Activity,
  Sparkles,
  Star
} from 'lucide-react';

// Mock data
const mockIssues = [
  { 
    id: 1, 
    category: 'Road Maintenance', 
    department: 'Public Works',
    location: 'Main St & 5th Ave', 
    priority: 'High', 
    status: 'Open', 
    date: '2024-01-15',
    citizenName: 'John Smith',
    citizenEmail: 'john.smith@email.com',
    citizenPhone: '+1 (555) 123-4567',
    assignedTo: 'Mike Johnson',
    description: 'Large pothole causing traffic issues and potential vehicle damage',
    resolutionTime: null,
    notes: ['Initial assessment completed', 'Materials ordered for repair']
  },
  { 
    id: 2, 
    category: 'Streetlight', 
    department: 'Utilities',
    location: 'Park Avenue', 
    priority: 'Medium', 
    status: 'In Progress', 
    date: '2024-01-14',
    citizenName: 'Sarah Davis',
    citizenEmail: 'sarah.davis@email.com',
    citizenPhone: '+1 (555) 987-6543',
    assignedTo: 'Tom Wilson',
    description: 'Street light flickering and causing safety concerns for pedestrians',
    resolutionTime: null,
    notes: ['Electrician dispatched', 'Replacement bulb installed']
  },
  { 
    id: 3, 
    category: 'Water Issue', 
    department: 'Utilities',
    location: 'Oak Street', 
    priority: 'High', 
    status: 'Resolved', 
    date: '2024-01-13',
    citizenName: 'Robert Brown',
    citizenEmail: 'robert.brown@email.com',
    citizenPhone: '+1 (555) 456-7890',
    assignedTo: 'Lisa Garcia',
    description: 'Water main break causing flooding in residential area',
    resolutionTime: 4,
    notes: ['Emergency crew dispatched', 'Water main repaired', 'Area cleaned up']
  },
  { 
    id: 4, 
    category: 'Trash Collection', 
    department: 'Sanitation',
    location: 'Elm Street', 
    priority: 'Low', 
    status: 'Open', 
    date: '2024-01-12',
    citizenName: 'Maria Rodriguez',
    citizenEmail: 'maria.rodriguez@email.com',
    citizenPhone: '+1 (555) 234-5678',
    assignedTo: null,
    description: 'Missed garbage pickup for the third consecutive week',
    resolutionTime: null,
    notes: ['Route supervisor notified']
  },
  { 
    id: 5, 
    category: 'Noise Complaint', 
    department: 'Code Enforcement',
    location: 'Cedar Ave', 
    priority: 'Medium', 
    status: 'In Progress', 
    date: '2024-01-11',
    citizenName: 'David Lee',
    citizenEmail: 'david.lee@email.com',
    citizenPhone: '+1 (555) 345-6789',
    assignedTo: 'Jennifer White',
    description: 'Construction noise exceeding permitted hours in residential zone',
    resolutionTime: null,
    notes: ['Site visit scheduled', 'Warning issued to contractor']
  }
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
    scale: 1.01,
    y: -2,
    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

export default function ReportsPage() {
  const [issues, setIssues] = useState(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "font-semibold shadow-lg border-0 px-3 py-1";
    switch (status) {
      case 'Open':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          Open
        </Badge>;
      case 'In Progress':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600`}>
          <Activity className="w-3 h-3 mr-1" />
          In Progress
        </Badge>;
      case 'Resolved':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600`}>
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Resolved
        </Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white`}>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "font-semibold shadow-lg border-0 px-3 py-1";
    switch (priority) {
      case 'High':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600`}>
          <Star className="w-3 h-3 mr-1" />
          High
        </Badge>;
      case 'Medium':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600`}>
          Medium
        </Badge>;
      case 'Low':
        return <Badge className={`${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600`}>
          Low
        </Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gradient-to-r from-gray-400 to-gray-500 text-white`}>{priority}</Badge>;
    }
  };

  const IssueModal = ({ issue, onClose }) => (
    <AnimatePresence>
      {issue && (
        <Dialog open={!!issue} onOpenChange={() => onClose()}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 border-0 shadow-2xl">
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
                  <DialogTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-2xl font-bold">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Issue #{issue.id}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(issue.status)}
                      {getPriorityBadge(issue.priority)}
                    </div>
                  </DialogTitle>
                </motion.div>
              </DialogHeader>
              
              <div className="space-y-8">
                {/* Issue Overview Cards */}
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Issue Details */}
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                          <FileText className="w-5 h-5 text-blue-600" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Issue Details
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Category</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.category}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Department</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.department}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Date Reported</span>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.date}</span>
                          </div>
                        </div>
                        {issue.assignedTo && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Assigned To</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Citizen Information */}
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <User className="w-5 h-5 text-emerald-600" />
                        </motion.div>
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          Citizen Information
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Name</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.citizenName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Email</span>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs">{issue.citizenEmail}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">Phone</span>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{issue.citizenPhone}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Location & Time */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <MapPin className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Location</h4>
                          <p className="text-gray-600 dark:text-gray-400">{issue.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {issue.resolutionTime && (
                    <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-xl">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Clock className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Resolution Time</h4>
                            <p className="text-2xl font-bold text-purple-600">{issue.resolutionTime} hours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          Description
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-4 rounded-lg border-l-4 border-indigo-500">
                        {issue.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Photos Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Camera className="w-5 h-5 text-cyan-600" />
                        <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          Attached Photos
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-8 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <motion.div
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-gray-500 font-medium">No photos attached</p>
                        <p className="text-sm text-gray-400 mt-2">Photos will appear here when uploaded</p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Status Timeline & Staff Notes */}
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {/* Status Timeline */}
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          Status Timeline
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <motion.div 
                          className="flex items-center space-x-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-l-4 border-blue-500"
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Issue Reported</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{issue.date}</p>
                          </div>
                        </motion.div>
                        
                        {issue.status !== 'Open' && (
                          <motion.div 
                            className="flex items-center space-x-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-l-4 border-yellow-500"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">In Progress</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to {issue.assignedTo}</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {issue.status === 'Resolved' && (
                          <motion.div 
                            className="flex items-center space-x-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500"
                            whileHover={{ x: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">Resolved</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Completed in {issue.resolutionTime} hours</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Staff Notes */}
                  <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Staff Notes
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {issue.notes.map((note, index) => (
                          <motion.div 
                            key={index}
                            className="p-3 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700 dark:to-purple-900/20 rounded-lg border-l-4 border-purple-400"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <p className="text-sm text-gray-700 dark:text-gray-300">{note}</p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
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
            Issue Reports
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage and track citizen-reported issues
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} whileHover="hover">
          <motion.div variants={cardHoverVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Filter className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Filters & Search
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search issues, locations, citizens..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg"
                    />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg">
                        <SelectValue placeholder="Filter by Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="Low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg border-0 transition-all duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
          variants={itemVariants}
        >
          <motion.p 
            className="text-gray-700 dark:text-gray-300 font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Showing <span className="font-bold text-blue-600">{filteredIssues.length}</span> of{' '}
            <span className="font-bold text-purple-600">{issues.length}</span> issues
          </motion.p>
          <motion.div 
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300 shadow-sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                {filteredIssues.filter(i => i.status === 'Open').length} Open
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300 shadow-sm">
                <Activity className="w-3 h-3 mr-1" />
                {filteredIssues.filter(i => i.status === 'In Progress').length} In Progress
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300 shadow-sm">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {filteredIssues.filter(i => i.status === 'Resolved').length} Resolved
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Issues Table */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-b-2 border-gray-200 dark:border-gray-700">
                      {['ID', 'Category', 'Department', 'Status', 'Priority', 'Location', 'Date', 'Actions'].map((header, index) => (
                        <TableHead 
                          key={header}
                          className="font-bold text-gray-700 dark:text-gray-300 py-4 px-6 text-center"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {header}
                          </motion.div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredIssues.map((issue, index) => (
                        <motion.tr
                          key={issue.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                          whileHover={{ scale: 1.005 }}
                        >
                          <TableCell className="font-bold text-center py-4 px-6">
                            <motion.span
                              className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg"
                              whileHover={{ rotate: 360, scale: 1.2 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {issue.id}
                            </motion.span>
                          </TableCell>
                          <TableCell className="font-medium text-center py-4 px-6 text-gray-800 dark:text-gray-200">
                            {issue.category}
                          </TableCell>
                          <TableCell className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                            {issue.department}
                          </TableCell>
                          <TableCell className="text-center py-4 px-6">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {getStatusBadge(issue.status)}
                            </motion.div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-6">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {getPriorityBadge(issue.priority)}
                            </motion.div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-6 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            <div className="flex items-center justify-center space-x-1">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span>{issue.location}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                            <div className="flex items-center justify-center space-x-1">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{issue.date}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4 px-6">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <Button
                                size="sm"
                                onClick={() => setSelectedIssue(issue)}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg border-0 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </motion.div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Issue Detail Modal */}
        <IssueModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
        />

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
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300"
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
              <FileText className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}