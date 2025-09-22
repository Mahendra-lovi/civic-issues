import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try password: 'password'",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@city.gov', role: 'Admin', icon: Shield, description: 'Full system access' },
    { email: 'staff@city.gov', role: 'Staff', icon: Users, description: 'Department-specific access' },
    { email: 'supervisor@city.gov', role: 'Supervisor', icon: Building2, description: 'Team management access' },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-civic">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-civic rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Civic Issues Dashboard
            </CardTitle>
            <CardDescription>
              Sign in to manage city infrastructure issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-civic text-white hover:shadow-hover transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8">
              <div className="text-sm text-muted-foreground text-center mb-4">
                Demo Accounts (Password: "password")
              </div>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <div
                    key={account.email}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setEmail(account.email)}
                  >
                    <div className="flex items-center space-x-3">
                      <account.icon className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{account.role}</div>
                        <div className="text-xs text-muted-foreground">{account.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{account.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}