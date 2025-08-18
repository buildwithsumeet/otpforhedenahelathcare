import React, { useState,useContext } from 'react';
import { loginApi } from '../../Api/loginApi';
import { 
  Users, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight,
  LogIn,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../ContextApi/UserContext';

const Login = () => {

  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  


  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginError, setLoginError] = useState('');

  // Validation functions
  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear login error when user changes input
    if (loginError) {
      setLoginError('');
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true
    });

    return Object.values(newErrors).every(error => !error);
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // Clear previous login error
//   setLoginError('');

//   if (!validateForm()) {
//     return;
//   }

//   setIsLoading(true);

//   try {
//     const response = await loginApi(formData.email, formData.password);
//     console.log(formData)

//     if (response.success) {
//       // ✅ Login successful, redirect or store token
//       console.log("Login successful:", response);
//       // Example: navigate to dashboard
//       // navigate("/dashboard");
//     } else {
//       // ❌ Show error message
//       setLoginError(response.message || 'Invalid credentials');
//     }
//   } catch (error) {
//     console.error("Login failed:", error);
//     setLoginError('Something went wrong. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');

  if (!validateForm()) return;
  setIsLoading(true);

  try {
    const response = await loginApi(formData.email, formData.password);
    // console.log("API Response:", response);

    if (response.success && response.message) {
      const { user } = response.message; // Only extract user, ignore tokens
      login(user); // Pass only user data to login function
      navigate('/');
    } else {
      setLoginError('Invalid credentials');
    }
  } catch (error) {
    // console.error("Login failed:", error);
    setLoginError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};





  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Connection network pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="login-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" className="text-indigo-400"/>
                <circle cx="18" cy="18" r="1" fill="currentColor" className="text-blue-400"/>
                <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="0.5" className="text-indigo-300"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-pattern)"/>
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full animate-float shadow-xl opacity-70"></div>
        <div className="absolute top-40 right-32 w-4 h-4 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full animate-float-delay-1 shadow-xl opacity-60"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full animate-float-delay-2 shadow-xl opacity-80"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full animate-float shadow-xl opacity-75"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 tracking-tight">
                  LetsConnect
                </span>
                <Sparkles className="text-amber-500 animate-pulse" size={20} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue connecting with people who matter</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            {/* Login Error Alert */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-red-700 text-sm font-medium">{loginError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50/50 backdrop-blur-sm ${
                      errors.email && touched.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : formData.email && !errors.email && touched.email
                        ? 'border-green-300 focus:ring-green-500' 
                        : 'border-slate-200'
                    }`}
                    placeholder="Enter your email"
                  />
                  {formData.email && !errors.email && touched.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50/50 backdrop-blur-sm ${
                      errors.password && touched.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : formData.password && !errors.password && touched.password
                        ? 'border-green-300 focus:ring-green-500' 
                        : 'border-slate-200'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                  {formData.password && !errors.password && touched.password && (
                    <div className="absolute inset-y-0 right-12 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-end">
                {/* <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <label htmlFor="remember-me" className="text-sm text-slate-600">
                    Remember me
                  </label>
                </div> */}
                <a 
                  href="/forgot-password" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Demo Account Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Account</h4>
                <p className="text-xs text-blue-700 mb-2">
                  Use these credentials to test the login:
                </p>
                <div className="space-y-1 text-xs text-blue-600">
                  <p><strong>Email:</strong> test@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div> */}

            {/* Social Login Buttons */}
            {/* <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium">Facebook</span>
              </button>
            </div> */}

            {/* Signup Link */}
            {/* <div className="mt-8 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                  Create one now
                </a>
              </p>
            </div> */}
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <a href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="/help" className="hover:text-slate-700 transition-colors">Help</a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-25px) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-float { 
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-delay-1 { 
          animation: float 10s ease-in-out infinite 2.5s;
        }
        .animate-float-delay-2 { 
          animation: float 10s ease-in-out infinite 5s;
        }
      `}</style>
    </div>
  );
};

export default Login;
