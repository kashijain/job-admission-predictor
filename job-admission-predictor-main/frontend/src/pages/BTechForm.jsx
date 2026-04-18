import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Loader, AlertCircle, Info, GraduationCap } from 'lucide-react';

const BTechForm = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        percentage12: 85,
        pcmPercentage: 88,
        jeeScore: 95,
        category: 'General',
        state: 'Delhi',
        preferredBranch: 'CSE',
        collegeType: 'Any'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const percentage12 = parseFloat(formData.percentage12);
        const pcmPercentage = parseFloat(formData.pcmPercentage);
        const jeeScore = parseFloat(formData.jeeScore);
        
        if (percentage12 < 0 || percentage12 > 100) {
            setError('12th Percentage must be between 0 and 100');
            return false;
        }
        if (pcmPercentage < 0 || pcmPercentage > 100) {
            setError('PCM Percentage must be between 0 and 100');
            return false;
        }
        if (jeeScore < 0) {
            setError('JEE Score cannot be negative');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📋 B.Tech form submitted');
        
        if (!validateForm()) {
            console.warn('❌ Form validation failed');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            console.log('🚀 Sending B.Tech prediction request:', formData);
            
            const { data } = await api.post('/predict/btech', formData);
            console.log('✅ B.Tech prediction response:', data);
            
            navigate('/result', { state: { ...data, type: 'btech', formData } });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Prediction failed. Please try again.';
            console.error('❌ B.Tech prediction error:', errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-8 text-white mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                <GraduationCap className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">B.Tech Admission Predictor</h1>
                                <p className="text-white text-opacity-90 mt-1">
                                    Predict your college admission chances
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-semibold">Rule-Based</p>
                            <p className="text-2xl font-bold">Predictor</p>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Enter Your Academic Profile</h2>
                        <p className="text-gray-600 text-sm">
                            Provide your scores for accurate college recommendations across Tier 1, 2, and 3 institutes.
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Info Box */}
                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3">
                            <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-emerald-900 mb-2">How we calculate your chances:</p>
                                <ul className="grid grid-cols-2 gap-2 text-sm text-emerald-800">
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                        JEE score (50% weight)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                        PCM Percentage (30%)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                        12th Grade (20%)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                                        Category bonus (if applicable)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 12th Percentage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        12th Board Percentage <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="percentage12"
                                        required
                                        value={formData.percentage12}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        disabled={loading}
                                        placeholder="e.g., 85.5"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">0-100</p>
                                </div>

                                {/* PCM Percentage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        PCM Percentage <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="pcmPercentage"
                                        required
                                        value={formData.pcmPercentage}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        disabled={loading}
                                        placeholder="e.g., 88.5"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Physics + Chemistry + Math</p>
                                </div>

                                {/* JEE Score */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        JEE Main Score / Percentile <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="jeeScore"
                                        required
                                        value={formData.jeeScore}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        disabled={loading}
                                        placeholder="e.g., 95.5 (percentile out of 100)"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter percentile score (NTA normalization)</p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="General">General</option>
                                        <option value="OBC">OBC (Other Backward Class)</option>
                                        <option value="SC">Scheduled Caste (SC)</option>
                                        <option value="ST">Scheduled Tribe (ST)</option>
                                        <option value="PWD">PwD (Person with Disability)</option>
                                    </select>
                                </div>

                                {/* Preferred Branch */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preferred Branch <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="preferredBranch"
                                        value={formData.preferredBranch}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="ECE">Electronics & Communication (ECE)</option>
                                        <option value="Mechanical">Mechanical Engineering</option>
                                        <option value="Electrical">Electrical Engineering</option>
                                        <option value="Civil">Civil Engineering</option>
                                        <option value="Chemical">Chemical Engineering</option>
                                        <option value="Aerospace">Aerospace Engineering</option>
                                        <option value="Biomedical">Biomedical Engineering</option>
                                    </select>
                                </div>

                                {/* College Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        College Type Preference <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="collegeType"
                                        value={formData.collegeType}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="Any">Any (Government or Private)</option>
                                        <option value="Government">Government Only</option>
                                        <option value="Private">Private Only</option>
                                    </select>
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State Preference <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="Delhi">Delhi</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="West Bengal">West Bengal</option>
                                        <option value="Odisha">Odisha</option>
                                        <option value="Other">Other States</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium transition duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Processing Prediction...
                                        </>
                                    ) : (
                                        <>
                                            <GraduationCap className="w-5 h-5" />
                                            Predict My College Chances
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                    <div>📊 <strong>Accurate:</strong> Rule-based analysis</div>
                    <div>🏆 <strong>Comprehensive:</strong> NITs, GFTIs, Private</div>
                    <div>⚡ <strong>Instant:</strong> Real-time recommendations</div>
                </div>
            </div>
        </div>
    );
};

export default BTechForm;
