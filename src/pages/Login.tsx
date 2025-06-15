
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Lock, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { loginUser } from '@/store/actions/authActions';
import { validateEmail, validateField } from '@/utils/validation';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandler';
import FormField from '@/components/common/FormField';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string[] } = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }
    
    const passwordValidation = validateField(formData.password, { required: true });
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    console.log('Login: Form submitted with email:', formData.email);

    try {
      console.log('Login: Dispatching loginUser action');
      const result = await dispatch(loginUser({ 
        email: formData.email, 
        password: formData.password 
      }, 'admin'));
      
      console.log('Login: Login result:', result);
      
      if (result) {
        console.log('Login: Success, showing toast and navigating');
        showSuccessToast("Welcome back!", "Successfully logged in to your dashboard");
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login: Login error caught:', err);
      showErrorToast('Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Access the exam management system</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                errors={fieldErrors.email}
                disabled={isFormDisabled}
                icon={<User className="w-4 h-4" />}
              />
              
              <FormField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                errors={fieldErrors.password}
                disabled={isFormDisabled}
                icon={<Lock className="w-4 h-4" />}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isFormDisabled}
              >
                {isFormDisabled ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Demo: admin@company.com / admin123 or hr@company.com / hr123
              </div>
              
              <div className="text-center">
                <Link 
                  to="/candidate-login" 
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Looking to practice coding? Try our practice platform
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
