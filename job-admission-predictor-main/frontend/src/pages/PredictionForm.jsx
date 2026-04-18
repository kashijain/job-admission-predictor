import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Loader, AlertCircle, Info, Briefcase, GraduationCap } from 'lucide-react';

const PredictionForm = () => {
    const { type } = useParams(); // 'job' or 'admission'
    const navigate = useNavigate();
    const isJob = type === 'job';
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        age: 21,
        gender: 'Male',
        stream: 'Computer Science',
        internships: 0,
        cgpa: 7.0,
        hostel: 0,
        backlogs: 0,
        skill: 'None',
        projects: 0,
        gateQualified: false,
        gateScore: '',
        gateRank: '',
        gatePaper: 'CS'
    });

    const handleChange = (e) => {
        const { name, value, type: inputType } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: inputType === 'checkbox' ? e.target.checked : value 
        }));
    };

    const validateForm = () => {
        const age = parseInt(formData.age);
        const cgpa = parseFloat(formData.cgpa);
        
        if (age < 18 || age > 40) {
            setError('Age must be between 18 and 40');
            return false;
        }
        if (cgpa < 0 || cgpa > 10) {
            setError('CGPA must be between 0 and 10');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📋 Form submitted');
        
        if (!validateForm()) {
            console.warn('❌ Form validation failed');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const endpoint = isJob ? '/predict/job' : '/predict/admission';
            console.log('🚀 Sending prediction request:', { endpoint, formData });
            
            const { data } = await api.post(endpoint, formData);
            console.log('✅ Prediction response received:', data);
            
            console.log('📍 Navigating to result page with:', { data, type, formData });
            navigate('/result', { state: { ...data, type, formData } });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Prediction failed. Please try again.';
            console.error('❌ Prediction error:', {
                message: errorMsg,
                status: err.response?.status,
                error: err
            });
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const modelInfo = isJob ? {
        gradient: 'from-blue-600 to-blue-700',
        bgGradient: 'from-blue-50 to-blue-100',
        title: 'Job Placement Predictor',
        model: 'Random Forest Classifier',
        modelAbbr: 'RFC',
        description: 'Predicts your placement probability based on academic performance and skills using a Random Forest ensemble model trained on historical placement data.',
        features: [
            'Analyzes 9+ academic features',
            'Ensemble of 100 decision trees',
            'Handles non-linear relationships',
            'Provides probability score (0-100%)'
        ]
    } : {
        gradient: 'from-purple-600 to-indigo-600',
        bgGradient: 'from-purple-50 to-indigo-100',
        title: 'M.Tech Admission Predictor',
        model: 'Logistic Regression',
        modelAbbr: 'LR',
        description: 'Estimates your admission probability to premier institutes based on academic credentials and project work using logistic regression.',
        features: [
            'Statistical probability model',
            'Weighted feature analysis',
            'CGPA, internships, projects focused',
            'Output ranges from 0-100%'
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Header Section with ML Model Info */}
                <div className={`bg-gradient-to-br ${modelInfo.gradient} rounded-2xl shadow-lg p-8 text-white mb-8`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                                {isJob ? (
                                    <Briefcase className="w-8 h-8" />
                                ) : (
                                    <GraduationCap className="w-8 h-8" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{modelInfo.title}</h1>
                                <p className="text-white text-opacity-90 mt-1">
                                    Powered by {modelInfo.model}
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg">
                            <p className="text-sm font-semibold">ML Model</p>
                            <p className="text-2xl font-bold">{modelInfo.modelAbbr}</p>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className={`bg-gradient-to-r ${modelInfo.bgGradient} p-6 border-b border-gray-100`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Student Profile Information</h2>
                        <p className="text-gray-600 text-sm">
                            {modelInfo.description}
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        {/* Model Features Info */}
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900 mb-2">This model analyzes:</p>
                                <ul className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                                    {modelInfo.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                            {feature}
                                        </li>
                                    ))}
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
                                {/* Age */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="18"
                                        max="40"
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">18 - 40 years</p>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                {/* Stream */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Engineering Stream <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="stream"
                                        value={formData.stream}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="Electronics And Communication">Electronics And Communication</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>

                                {/* CGPA */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CGPA (Out of 10) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="cgpa"
                                        required
                                        value={formData.cgpa}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        max="10"
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                </div>

                                {/* Primary Skill */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Primary Skill <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="skill"
                                        value={formData.skill}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value="None">None / Basics</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Java">Java / Spring</option>
                                        <option value="Python">Python / Django</option>
                                        <option value="Data Science">Data Science / ML</option>
                                    </select>
                                </div>

                                {/* Internships */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Internships <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="internships"
                                        required
                                        value={formData.internships}
                                        onChange={handleChange}
                                        min="0"
                                        max="10"
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                </div>

                                {/* Projects */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Projects <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="projects"
                                        required
                                        value={formData.projects}
                                        onChange={handleChange}
                                        min="0"
                                        max="20"
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    />
                                </div>

                                {/* Backlogs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        History of Backlogs? <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="backlogs"
                                        value={formData.backlogs}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value={0}>No (0 backlogs)</option>
                                        <option value={1}>Yes (1 or more)</option>
                                    </select>
                                </div>

                                {/* Hostel */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hostel Resident? <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="hostel"
                                        value={formData.hostel}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    >
                                        <option value={0}>Day Scholar</option>
                                        <option value={1}>Hosteller</option>
                                    </select>
                                </div>
                            </div>

                            {/* GATE Exam Section (Only for admission) */}
                            {!isJob && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">GATE Exam Details</h3>
                                    <p className="text-xs text-gray-600 mb-4">Optional: Including GATE details strengthens your college recommendations</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* GATE Qualified */}
                                        <div className="md:col-span-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                                <input
                                                    type="checkbox"
                                                    name="gateQualified"
                                                    checked={formData.gateQualified}
                                                    onChange={handleChange}
                                                    disabled={loading}
                                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    I have qualified GATE
                                                </span>
                                            </label>
                                        </div>

                                        {/* Show GATE fields only if qualified */}
                                        {formData.gateQualified && (
                                            <>
                                                {/* GATE Score */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        GATE Score <span className="text-gray-500">(Optional)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="gateScore"
                                                        value={formData.gateScore}
                                                        onChange={handleChange}
                                                        min="0"
                                                        max="1000"
                                                        placeholder="Out of 1000"
                                                        disabled={loading}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                                    />
                                                </div>

                                                {/* GATE Rank */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        GATE Rank <span className="text-gray-500">(Optional)</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="gateRank"
                                                        value={formData.gateRank}
                                                        onChange={handleChange}
                                                        min="1"
                                                        placeholder="Your GATE rank"
                                                        disabled={loading}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                                    />
                                                </div>

                                                {/* GATE Paper */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        GATE Paper <span className="text-gray-500">(Optional)</span>
                                                    </label>
                                                    <select
                                                        name="gatePaper"
                                                        value={formData.gatePaper}
                                                        onChange={handleChange}
                                                        disabled={loading}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                                    >
                                                        <option value="CS">Computer Science (CS)</option>
                                                        <option value="EC">Electronics & Communication (EC)</option>
                                                        <option value="ME">Mechanical Engineering (ME)</option>
                                                        <option value="CE">Civil Engineering (CE)</option>
                                                        <option value="EE">Electrical Engineering (EE)</option>
                                                        <option value="IN">Instrumentation (IN)</option>
                                                        <option value="PI">Production & Industrial (PI)</option>
                                                        <option value="BT">Biotechnology (BT)</option>
                                                        <option value="CH">Chemical Engineering (CH)</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-white font-medium transition duration-200 flex items-center justify-center gap-2 ${
                                        isJob
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                                    } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Processing Prediction...
                                        </>
                                    ) : (
                                        <>
                                            {isJob ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                                            Get Prediction
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                    <div>🔒 <strong>Secure:</strong> Your data is encrypted</div>
                    <div>📊 <strong>Accurate:</strong> ML-powered analysis</div>
                    <div>⚡ <strong>Instant:</strong> Real-time results</div>
                </div>
            </div>
        </div>
    );
};

export default PredictionForm;
