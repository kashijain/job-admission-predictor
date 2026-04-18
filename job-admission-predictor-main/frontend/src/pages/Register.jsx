import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters');
            return false;
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            setSuccess(true);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMsg);
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                        <p className="text-gray-600 mb-6">Your account has been successfully created. Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">PredictGenius</h1>
                    <p className="text-gray-500 mt-2">Join our prediction platform</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
                    <p className="text-gray-500 text-sm mb-6">Sign up to get started with predictions</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Create Account
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
                            <span className="px-2 bg-white text-gray-500">Already registered?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                        <Link
                            to="/login"
                            className="font-medium text-green-600 hover:text-green-700 transition"
                        >
                            Sign in to your account
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

export default Register;
