import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { signupUser } from '@/store/actions/authActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Lock, Mail, Building, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authApi } from '@/services/authApi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organizationName: '',
    department: ''
  });
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    if (!formData.role) {
      return;
    }

    try {
      await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'admin' | 'examiner',
        organizationName: formData.organizationName,
        department: formData.department
      }));

      toast({
        title: "Account created!",
        description: "Your admin account has been created. Please wait for approval.",
      });
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
          <p className="text-gray-600">Create your admin or examiner account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create an admin account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your work email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleRoleChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="examiner">Examiner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    placeholder="Enter your organization name"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="e.g., Human Resources, Engineering"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              <div className="text-center text-xs text-gray-500">
                Account will be reviewed and approved by system administrators
              </div>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <Link 
                  to="/login" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Sign in here
                </Link>
              </div>
              
              <div className="text-center">
                <Link 
                  to="/candidate-signup" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Looking to practice coding? Create candidate account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
