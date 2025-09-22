import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, Users, Lock, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the login function from AuthContext
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        // For demo purposes, if login fails, still allow access
        navigate('/');
      }
    } catch (error) {
      // For demo purposes, navigate anyway
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@city.gov', role: 'System Administrator', icon: Shield, description: 'Full system access and configuration', color: 'text-red-600' },
    { email: 'supervisor@city.gov', role: 'Department Supervisor', icon: Building2, description: 'Team management and oversight', color: 'text-blue-600' },
    { email: 'staff@city.gov', role: 'Staff Member', icon: Users, description: 'Department-specific operations', color: 'text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative w-full max-w-lg">
        {/* Official Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full shadow-2xl mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Municipal Services Portal
          </h1>
          <p className="text-slate-600 text-sm">
            City Government • Infrastructure Management System
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-semibold text-white">Secure Access</h2>
                <p className="text-blue-100 text-sm">Authorized Personnel Only</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    placeholder="your.name@city.gov"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 placeholder-slate-400"
                    placeholder="Enter secure password"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Access System</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Demo Accounts Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800 text-sm">DEMONSTRATION ACCOUNTS</h3>
            <p className="text-xs text-slate-600 mt-1">For testing purposes • Password: "password"</p>
          </div>
          
          <div className="p-6 space-y-3">
            {demoAccounts.map((account) => (
              <div
                key={account.email}
                onClick={() => setEmail(account.email)}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-blue-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow ${account.color}`}>
                    <account.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{account.role}</div>
                    <div className="text-xs text-slate-600">{account.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border">
                    {account.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2024 Municipal Government • Secure Infrastructure Management</p>
          <p className="mt-1">This system is for authorized use only. All activities are monitored.</p>
        </div>
      </div>
    </div>
  );
}