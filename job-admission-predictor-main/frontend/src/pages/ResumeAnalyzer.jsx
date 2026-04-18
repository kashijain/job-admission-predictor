import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, FileText, ArrowRight, Loader } from 'lucide-react';
import api from '../services/api';

const ResumeAnalyzer = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('Full Stack Developer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const roles = [
        'Frontend Developer',
        'Full Stack Developer',
        'ML Intern',
        'Data Analyst'
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedExtensions = ['pdf', 'docx'];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            setError('Only PDF and DOCX files are supported');
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File size must be under 10MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a resume file');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('role', targetRole);

            const { data } = await api.post('/tools/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error analyzing resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => {
                                setResults(null);
                                setFile(null);
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
                        >
                            ← Back to Upload
                        </button>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analysis Results</h1>
                        <p className="text-gray-600">For role: <span className="font-semibold text-blue-600">{results.role_analyzed}</span></p>
                    </div>

                    {/* Main Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-blue-200">
                            <p className="text-sm text-gray-500 mb-2">Estimated ATS Score</p>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">{results.estimated_ats_score}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-700 font-medium mb-2">
                                        {results.estimated_ats_score >= 80 && '✨ Excellent'}
                                        {results.estimated_ats_score >= 60 && results.estimated_ats_score < 80 && '👍 Good'}
                                        {results.estimated_ats_score < 60 && '⚠️ Needs Work'}
                                    </p>
                                    <p className="text-sm text-gray-600">{results.summary}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-3">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <p className="text-sm text-gray-600 mb-2">Detected Skills</p>
                                <p className="text-3xl font-bold text-emerald-600">{results.detected_skills.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                <p className="text-sm text-gray-600 mb-2">Missing Required</p>
                                <p className="text-3xl font-bold text-orange-600">{results.missing_required_skills.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
                        <div className="space-y-4">
                            {Object.entries(results.breakdown).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-700 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-bold text-blue-600">{value.toFixed(1)} pts</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                            style={{ width: `${(value / 30) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Detected Skills */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-lg font-bold text-gray-900">Detected Skills ({results.detected_skills.length})</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {results.detected_skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                <h3 className="text-lg font-bold text-gray-900">Missing Key Skills</h3>
                            </div>
                            <div className="space-y-2">
                                {results.missing_required_skills.map((skill) => (
                                    <p key={skill} className="text-gray-700">
                                        <span className="font-medium text-orange-600">•</span> {skill}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sections Present */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Resume Sections</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(results.sections_present).map(([section, present]) => (
                                <div
                                    key={section}
                                    className={`p-4 rounded-lg text-center ${
                                        present ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    <p className="text-sm font-medium capitalize">{section}</p>
                                    <p className="text-2xl mt-2">{present ? '✓' : '✗'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Improvement Suggestions */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">📝 Improvement Suggestions</h3>
                        <ol className="space-y-3">
                            {results.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700 pt-0.5">{suggestion}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setResults(null);
                                setFile(null);
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Analyze Another Resume
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analyzer</h1>
                    <p className="text-gray-600">
                        Get your resume analyzed with an estimated ATS score, skill detection, and improvement suggestions
                    </p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-8">
                    <form onSubmit={handleAnalyze} className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                Upload Your Resume
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                                    file
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    {file ? (
                                        <>
                                            <FileText className="w-12 h-12 text-emerald-600" />
                                            <p className="text-gray-900 font-medium">{file.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400" />
                                            <p className="text-gray-900 font-medium">Click to upload or drag and drop</p>
                                            <p className="text-sm text-gray-500">PDF or DOCX (up to 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx"
                                    className="hidden"
                                    id="file-input"
                                />
                                <label
                                    htmlFor="file-input"
                                    className="absolute inset-0 w-full h-full cursor-pointer rounded-2xl"
                                />
                            </div>
                            {file && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFile(null);
                                        setError('');
                                    }}
                                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {/* Target Role Selection */}
                        <div>
                            <label className="block text-lg font-bold text-gray-900 mb-3">
                                Target Role
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setTargetRole(role)}
                                        className={`p-4 rounded-lg border-2 font-medium transition ${
                                            targetRole === role
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!file || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Analyze Resume
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-3">ℹ️ How It Works</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ Upload your resume in PDF or DOCX format</li>
                        <li>✓ Select your target job role</li>
                        <li>✓ Our AI analyzes your resume for ATS compatibility</li>
                        <li>✓ Get instant feedback with a skill-based ATS score</li>
                        <li>✓ Receive actionable suggestions for improvement</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-4">
                        Note: This is an estimated ATS score based on resume structure and keywords. Actual ATS scores vary by company.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
