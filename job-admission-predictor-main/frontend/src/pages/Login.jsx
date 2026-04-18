import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('demo@student.com'); // Demo prefill
    const [password, setPassword] = useState('password123'); // Demo prefill
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            
            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMsg);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">PredictGenius</h1>
                    <p className="text-gray-500 mt-2">Job & Admission Prediction Platform</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mb-6">Sign in to access your predictions</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Demo Credentials Info */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-2">Demo Credentials:</p>
                        <p className="text-xs text-blue-800"><strong>Email:</strong> demo@student.com</p>
                        <p className="text-xs text-blue-800"><strong>Password:</strong> password123</p>
                        <p className="text-xs text-blue-800 mt-2"><strong>Admin:</strong> admin@predictgenius.com / admin123</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-700 transition"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    © 2026 PredictGenius. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
