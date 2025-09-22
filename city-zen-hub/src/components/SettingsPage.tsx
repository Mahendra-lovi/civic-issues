import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Settings, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Building2, 
  FileText,
  Database,
  Bell,
  Lock,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  Server,
  Mail,
  Smartphone,
  Eye,
  Download,
  Upload,
  Cog
} from 'lucide-react';

// Mock data
const mockStaff = [
  { id: '1', name: 'Mike Wilson', role: 'Senior Technician', department: 'Public Works', email: 'mike.w@city.gov', phone: '+1 (555) 123-4567' },
  { id: '2', name: 'Carlos Rodriguez', role: 'Electrical Specialist', department: 'Street Lighting', email: 'carlos.r@city.gov', phone: '+1 (555) 234-5678' },
  { id: '3', name: 'Sarah Brown', role: 'Sanitation Supervisor', department: 'Sanitation', email: 'sarah.b@city.gov', phone: '+1 (555) 345-6789' },
  { id: '4', name: 'Amy Chen', role: 'Water Engineer', department: 'Water Department', email: 'amy.c@city.gov', phone: '+1 (555) 456-7890' },
  { id: '5', name: 'Tom Garcia', role: 'Parks Specialist', department: 'Parks & Recreation', email: 'tom.g@city.gov', phone: '+1 (555) 567-8901' }
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

export default function SettingsPage() {
  const [staff, setStaff] = useState(mockStaff);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('users');
  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: ''
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.role || !newUser.department || !newUser.email) {
      return;
    }

    const newStaffMember = {
      id: (staff.length + 1).toString(),
      ...newUser
    };

    setStaff([...staff, newStaffMember]);
    setNewUser({ name: '', role: '', department: '', email: '', phone: '' });
    setAddUserDialogOpen(false);
  };

  const handleDeleteUser = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const categories = ['Pothole', 'Street Light', 'Garbage Collection', 'Water Leak', 'Park Maintenance', 'Traffic Signal'];
  const departments = ['Public Works', 'Sanitation', 'Water Department', 'Parks & Recreation', 'Street Lighting'];

  const settingsNavigation = [
    { key: 'users', label: 'User Management', icon: Users, color: 'from-blue-500 to-blue-700', description: 'Manage staff accounts and permissions' },
    { key: 'departments', label: 'Departments', icon: Building2, color: 'from-emerald-500 to-emerald-700', description: 'Configure organizational units' },
    { key: 'categories', label: 'Categories', icon: FileText, color: 'from-purple-500 to-purple-700', description: 'Manage issue categories' },
    { key: 'system', label: 'System Logs', icon: Database, color: 'from-orange-500 to-orange-700', description: 'Monitor system activity' }
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
          <div className="flex justify-center items-center space-x-4 mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Cog className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2"
            animate={{ 
              background: [
                'linear-gradient(to right, #4f46e5, #8b5cf6, #1e40af)',
                'linear-gradient(to right, #8b5cf6, #1e40af, #4f46e5)',
                'linear-gradient(to right, #1e40af, #4f46e5, #8b5cf6)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            System Settings
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage users, departments, and system configuration
          </motion.p>
        </motion.div>

        {/* Settings Navigation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {settingsNavigation.map((section, index) => (
            <motion.div
              key={section.key}
              variants={itemVariants}
              whileHover="hover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
              onClick={() => setActiveSection(section.key)}
            >
              <motion.div variants={cardHoverVariants}>
                <Card className={`cursor-pointer overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  activeSection === section.key 
                    ? 'ring-2 ring-indigo-500 ring-offset-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' 
                    : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm'
                }`}>
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <section.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">{section.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                    {activeSection === section.key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="mt-3"
                      >
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-lg">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* User Management Section */}
        <AnimatePresence mode="wait">
          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      >
                        <Users className="w-6 h-6 text-blue-600" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        User Management
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                          <Users className="w-3 h-3 mr-1" />
                          {staff.length} Users
                        </Badge>
                      </motion.div>
                    </CardTitle>
                    <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg border-0 transition-all duration-300">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                          </Button>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 border-0 shadow-2xl">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <DialogHeader className="pb-6">
                            <DialogTitle className="flex items-center space-x-2 text-2xl font-bold">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <UserPlus className="w-6 h-6 text-green-600" />
                              </motion.div>
                              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Add New Staff Member
                              </span>
                              <Sparkles className="w-5 h-5 text-purple-500" />
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {[
                              { key: 'name', label: 'Full Name *', placeholder: 'Enter full name', type: 'text' },
                              { key: 'role', label: 'Role *', placeholder: 'e.g., Senior Technician', type: 'text' },
                              { key: 'email', label: 'Email *', placeholder: 'Enter email address', type: 'email' },
                              { key: 'phone', label: 'Phone', placeholder: 'Enter phone number', type: 'tel' }
                            ].map((field, index) => (
                              <motion.div
                                key={field.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Label htmlFor={field.key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {field.label}
                                </Label>
                                <Input
                                  id={field.key}
                                  type={field.type}
                                  value={newUser[field.key]}
                                  onChange={(e) => setNewUser({...newUser, [field.key]: e.target.value})}
                                  placeholder={field.placeholder}
                                  className="mt-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg"
                                />
                              </motion.div>
                            ))}
                            
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Department *
                              </Label>
                              <Select value={newUser.department} onValueChange={(value) => setNewUser({...newUser, department: value})}>
                                <SelectTrigger className="mt-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
                                  {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </motion.div>

                            <motion.div 
                              className="flex justify-end space-x-3 pt-4"
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
                                  onClick={() => setAddUserDialogOpen(false)}
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
                                  onClick={handleAddUser}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg border-0 transition-all duration-300"
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Add User
                                </Button>
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-b-2 border-gray-200 dark:border-gray-700">
                          {['Name', 'Role', 'Department', 'Email', 'Phone', 'Actions'].map((header, index) => (
                            <TableHead 
                              key={header}
                              className="font-bold text-gray-700 dark:text-gray-300 py-4 px-6"
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
                          {staff.map((member, index) => (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-300 border-b border-gray-100 dark:border-gray-700"
                              whileHover={{ scale: 1.005 }}
                            >
                              <TableCell className="font-semibold py-4 px-6 text-gray-800 dark:text-gray-200">
                                {member.name}
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                {member.role}
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                {member.department}
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                {member.email}
                              </TableCell>
                              <TableCell className="py-4 px-6 text-gray-600 dark:text-gray-400">
                                {member.phone}
                              </TableCell>
                              <TableCell className="py-4 px-6">
                                <div className="flex items-center space-x-2">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                  >
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all duration-300"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                  >
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteUser(member.id)}
                                      className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </div>
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
          )}
        </AnimatePresence>

        {/* System Configuration */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Departments Configuration */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  >
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Departments
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-700 dark:to-emerald-900/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{dept}</span>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                          <Users className="w-3 h-3 mr-1" />
                          {staff.filter(s => s.department === dept).length} staff
                        </Badge>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-emerald-100 dark:hover:bg-emerald-900/20 hover:text-emerald-600 transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Add Department
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Categories Configuration */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardTitle className="flex items-center space-x-2 text-lg font-bold">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FileText className="w-5 h-5 text-purple-600" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Issue Categories
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-700 dark:to-purple-900/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{category}</span>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-purple-100 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all duration-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* System Settings */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Shield className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  System Settings
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Notifications',
                    icon: Bell,
                    color: 'from-blue-500 to-cyan-500',
                    settings: [
                      { name: 'Email notifications', status: 'Enabled', icon: Mail, statusType: 'success' },
                      { name: 'SMS alerts', status: 'Disabled', icon: Smartphone, statusType: 'neutral' },
                      { name: 'Push notifications', status: 'Enabled', icon: Bell, statusType: 'success' }
                    ]
                  },
                  {
                    title: 'Security',
                    icon: Lock,
                    color: 'from-red-500 to-pink-500',
                    settings: [
                      { name: 'Two-factor auth', status: 'Required', icon: Shield, statusType: 'success' },
                      { name: 'Session timeout', status: '8 hours', icon: Clock, statusType: 'neutral' },
                      { name: 'Password policy', status: 'Strong', icon: Lock, statusType: 'success' }
                    ]
                  },
                  {
                    title: 'Data & Backup',
                    icon: Database,
                    color: 'from-emerald-500 to-teal-500',
                    settings: [
                      { name: 'Auto backup', status: 'Daily', icon: Upload, statusType: 'success' },
                      { name: 'Data retention', status: '7 years', icon: Database, statusType: 'neutral' },
                      { name: 'Export format', status: 'CSV/PDF', icon: Download, statusType: 'neutral' }
                    ]
                  }
                ].map((section, sectionIndex) => (
                  <motion.div 
                    key={section.title}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.2 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <motion.div
                        className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <section.icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{section.title}</h4>
                    </div>
                    <div className="space-y-3">
                      {section.settings.map((setting, index) => (
                        <motion.div 
                          key={setting.name}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (sectionIndex * 0.2) + (index * 0.1) }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex items-center space-x-2">
                            <setting.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{setting.name}</span>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Badge className={`${
                              setting.statusType === 'success' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' 
                                : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0'
                            } shadow-sm font-semibold`}>
                              {setting.statusType === 'success' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {setting.status}
                            </Badge>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Logs */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity className="w-6 h-6 text-orange-600" />
                </motion.div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Recent System Activity
                </span>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                  Live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { time: '2024-01-15 14:30', action: 'User login', user: 'admin@city.gov', details: 'Successful login from 192.168.1.100', type: 'success' },
                  { time: '2024-01-15 14:25', action: 'Issue assigned', user: 'staff@city.gov', details: 'Issue ISS001 assigned to Mike Wilson', type: 'info' },
                  { time: '2024-01-15 14:20', action: 'New issue reported', user: 'system', details: 'Issue ISS004 created - Water leak at Center Plaza', type: 'warning' },
                  { time: '2024-01-15 14:15', action: 'Task completed', user: 'mike.w@city.gov', details: 'Pothole repair completed on Main St', type: 'success' },
                  { time: '2024-01-15 14:10', action: 'User added', user: 'admin@city.gov', details: 'New staff member Jessica Martinez added', type: 'info' },
                ].map((log, index) => (
                  <motion.div 
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-l-4 hover:shadow-lg transition-all duration-300 ${
                      log.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500' :
                      log.type === 'warning' ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-500' :
                      'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-500'
                    }`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <motion.div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                            log.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            log.type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                            'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-white" />}
                          {log.type === 'warning' && <AlertCircle className="w-4 h-4 text-white" />}
                          {log.type === 'info' && <Activity className="w-4 h-4 text-white" />}
                        </motion.div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{log.action}</span>
                        <Badge className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-0 text-xs">
                          {log.user}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">{log.details}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 ml-11 sm:ml-0">
                      <Clock className="w-3 h-3" />
                      <span>{log.time}</span>
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
              <Cog className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}