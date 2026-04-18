import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, GraduationCap, MessageSquare, LogOut, Menu, X, BarChart3, FileText } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">PredictGenius</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <span className="text-gray-700">
                                <span className="text-sm text-gray-500">Logged in as</span>
                                <div className="font-semibold text-gray-900">{user?.email}</div>
                            </span>
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium text-sm"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Logout"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 border-t border-gray-200 space-y-3 mt-4">
                            <div className="px-2 py-2 text-sm">
                                <p className="text-gray-500">Logged in as</p>
                                <p className="font-semibold text-gray-900">{user?.email}</p>
                            </div>
                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name || 'Student'}</span>!
                    </h1>
                    <p className="text-gray-600">
                        Use our advanced ML models to predict your placement and admission prospects
                    </p>
                </div>

                {/* Main Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Job Placement Predictor Card */}
                    <div
                        onClick={() => navigate('/predict/job')}
                        className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 min-h-[280px] flex flex-col"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Job Placement Predictor</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                            Predict your chances of getting placed using advanced analytics and real placement data.
                        </p>
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl">
                            Start Prediction <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    {/* M.Tech Admission Predictor Card */}
                    <div
                        onClick={() => navigate('/predict/admission')}
                        className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 min-h-[280px] flex flex-col"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">M.Tech Admission Predictor</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                            Find your chances of getting into premier institutes with personalized recommendations.
                        </p>
                        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl">
                            Start Prediction <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    {/* B.Tech Admission Predictor Card */}
                    <div
                        onClick={() => navigate('/predict/btech')}
                        className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 min-h-[280px] flex flex-col"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">B.Tech Admission Predictor</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                            Predict your admission chances to top colleges based on JEE score, 12th percentage, and branch preference.
                        </p>
                        <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl">
                            Start Prediction <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    {/* Resume Analyzer Card */}
                    <div
                        onClick={() => navigate('/tools/resume')}
                        className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 min-h-[280px] flex flex-col"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Resume Analyzer</h3>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                            Analyze your resume for ATS compatibility, get an estimated ATS score, and receive improvement suggestions.
                        </p>
                        <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl">
                            Analyze Resume <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    {/* File a Complaint Card */}
                    <div className="md:col-span-2 flex justify-center">
                        <div
                            onClick={() => navigate('/complaint')}
                            className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-105 min-h-[280px] flex flex-col w-full md:max-w-[calc(50%-0.75rem)]"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">File a Complaint</h3>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                                Report issues or suggestions. Our system automatically detects and manages duplicate complaints.
                            </p>
                            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-md hover:shadow-lg group-hover:shadow-xl">
                                Submit Ticket <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3">How It Works</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Fill in your academic details accurately</li>
                            <li>Our ML models analyze your profile</li>
                            <li>Get instant prediction with confidence score</li>
                            <li>Track your predictions in your profile</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3">Your Data is Safe</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Secure JWT authentication</li>
                            <li>MongoDB encrypted database</li>
                            <li>HTTPS ready for deployment</li>
                            <li>No data is shared with third parties</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
