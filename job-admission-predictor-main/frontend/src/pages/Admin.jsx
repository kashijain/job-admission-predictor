import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Users, AlertTriangle, Activity, LogOut, ArrowLeft, Filter, Calendar } from 'lucide-react';

const Admin = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [complaintFilter, setComplaintFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersRes, complaintsRes, predictionsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/complaints'),
                    api.get('/admin/predictions')
                ]);
                setUsers(usersRes.data.users || []);
                setComplaints(complaintsRes.data.complaints || []);
                setPredictions(predictionsRes.data.predictions || []);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch admin data');
                console.error('Admin data fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    const formatDate = (isoDate) => {
        try {
            return new Date(isoDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    const filteredComplaints = complaintFilter === 'all'
        ? complaints
        : complaints.filter(c => c.status === complaintFilter);

    const placedCount = predictions.filter(p => p.result === 1 || p.probability > 50).length;
    const admissionHighChance = predictions.filter(p => p.probability > 70).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                                <p className="text-xs text-gray-500">PredictGenius Monitoring</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Logged in as</p>
                                <p className="font-semibold text-gray-900">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Logout"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Error Message */}
            {error && (
                <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-gray-600 mt-2">Real-time monitoring of platform activity and predictions</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Total Users */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
                        <p className="text-gray-600 text-sm mt-1">Registered Users</p>
                    </div>

                    {/* Total Complaints */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Active</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{complaints.length}</h3>
                        <p className="text-gray-600 text-sm mt-1">Complaints Logged</p>
                    </div>

                    {/* Total Predictions */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{predictions.length}</h3>
                        <p className="text-gray-600 text-sm mt-1">Predictions Made</p>
                    </div>

                    {/* Success Rate */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Activity className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Rate</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {predictions.length > 0 ? Math.round((placedCount / predictions.length) * 100) : 0}%
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">Placement/Admission Rate</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setSelectedTab('overview')}
                        className={`px-4 py-3 font-medium border-b-2 transition ${
                            selectedTab === 'overview'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        📊 Overview
                    </button>
                    <button
                        onClick={() => setSelectedTab('users')}
                        className={`px-4 py-3 font-medium border-b-2 transition ${
                            selectedTab === 'users'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button
                        onClick={() => setSelectedTab('complaints')}
                        className={`px-4 py-3 font-medium border-b-2 transition ${
                            selectedTab === 'complaints'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        🔔 Complaints ({complaints.length})
                    </button>
                </div>

                {/* Tab Content */}

                {/* Overview Tab */}
                {selectedTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Prediction Insights</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">Job Placements ({'>'}50% chance):</span>
                                    <span className="font-bold text-blue-600">{placedCount}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">High Admission Chances ({'>'}70%):</span>
                                    <span className="font-bold text-purple-600">{admissionHighChance}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">Average Confidence:</span>
                                    <span className="font-bold text-green-600">
                                        {predictions.length > 0
                                            ? (predictions.reduce((acc, p) => acc + (p.probability || 0), 0) / predictions.length).toFixed(1)
                                            : 0}%
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Complaint Status</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">Pending:</span>
                                    <span className="font-bold text-yellow-600">{complaints.filter(c => c.status === 'Pending').length}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">Resolved:</span>
                                    <span className="font-bold text-green-600">{complaints.filter(c => c.status === 'Resolved').length}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                    <span className="text-gray-700">In Progress:</span>
                                    <span className="font-bold text-blue-600">{complaints.filter(c => c.status === 'In Progress').length}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {selectedTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Predictions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.length > 0 ? (
                                        users.map((u, idx) => {
                                            const userPredictions = predictions.filter(p => p.user_id === u._id).length;
                                            return (
                                                <tr key={idx} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">{u.name || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            u.role === 'admin'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {formatDate(u.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{userPredictions}</td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Complaints Tab */}
                {selectedTab === 'complaints' && (
                    <div>
                        {/* Filter */}
                        <div className="mb-6 flex gap-2">
                            <Filter className="w-5 h-5 text-gray-600 mt-1" />
                            <select
                                value={complaintFilter}
                                onChange={(e) => setComplaintFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Subject</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredComplaints.length > 0 ? (
                                            filteredComplaints.slice(0, 10).map((c, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{c.email}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 truncate">{c.subject}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            c.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : c.status === 'In Progress'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(c.timestamp)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                    No complaints found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
