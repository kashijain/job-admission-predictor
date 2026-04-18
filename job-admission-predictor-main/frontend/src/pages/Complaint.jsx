import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Send, Loader, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Complaint = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(null); // { type: 'error' | 'success' | 'duplicate', msg: '' }
    const [loading, setLoading] = useState(false);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);
    const [isDaplicate, setIsDuplicate] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    const checkForDuplicate = async () => {
        if (!description.trim()) {
            setStatus({ type: 'error', msg: 'Please enter a description first' });
            return;
        }

        setCheckingDuplicate(true);
        try {
            const { data } = await api.post('/complaint/check-duplicate', { description });
            setIsDuplicate(data.is_duplicate);
            
            if (data.is_duplicate) {
                setStatus({
                    type: 'duplicate',
                    msg: '🚨 This complaint is similar to an existing one (80%+ match). Consider reviewing previous complaints or providing more details to differentiate.'
                });
            } else {
                setStatus({
                    type: 'success',
                    msg: '✓ This complaint is unique! No duplicates found in the system.'
                });
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.message || 'Failed to check for duplicates'
            });
            console.error('Duplicate check error:', err);
        } finally {
            setCheckingDuplicate(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subject.trim()) {
            setStatus({ type: 'error', msg: 'Please enter a subject' });
            return;
        }
        if (!description.trim()) {
            setStatus({ type: 'error', msg: 'Please enter a description' });
            return;
        }
        if (isDaplicate) {
            setStatus({
                type: 'error',
                msg: 'Cannot submit duplicate complaint. Please modify your complaint or contact support.'
            });
            return;
        }

        setLoading(true);
        setStatus(null);
        
        try {
            const { data } = await api.post('/complaint/add', { subject, description });
            setStatus({
                type: 'success',
                msg: `✓ Complaint submitted successfully! ID: ${data.complaint_id.slice(-8)}`
            });
            setSubject('');
            setDescription('');
            setIsDuplicate(false);
            
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to submit complaint';
            setStatus({ type: 'error', msg: errorMsg });
            console.error('Submit error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
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
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg p-8 text-white mb-8">
                    <h1 className="text-3xl font-bold mb-2">Support & Complaints</h1>
                    <p className="text-white text-opacity-90">
                        Report issues, bugs, or submit suggestions. Our AI automatically detects duplicate complaints to keep support organized.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Instructions */}
                    <div className="p-6 bg-blue-50 border-b border-gray-200">
                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            How This Works:
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>✓ Describe your issue clearly in the complaint description</li>
                            <li>✓ Click "Check for Duplicates" to scan our AI system</li>
                            <li>✓ If unique, submit your complaint for support</li>
                            <li>✓ admin@predictgenius.com will review and respond</li>
                        </ul>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        {/* Status Messages */}
                        {status && (
                            <div className={`mb-6 p-4 rounded-lg border flex gap-3 ${
                                status.type === 'error'
                                    ? 'bg-red-50 border-red-200'
                                    : status.type === 'duplicate'
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-green-50 border-green-200'
                            }`}>
                                {status.type === 'error' && (
                                    <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                        status.type === 'error' ? 'text-red-600' : ''
                                    }`} />
                                )}
                                {status.type === 'duplicate' && (
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                )}
                                {status.type === 'success' && (
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                )}
                                <p className={`text-sm ${
                                    status.type === 'error'
                                        ? 'text-red-700'
                                        : status.type === 'duplicate'
                                        ? 'text-yellow-700'
                                        : 'text-green-700'
                                }`}>
                                    {status.msg}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    placeholder="e.g., Prediction model not loading for IT branch"
                                    maxLength={100}
                                />
                                <p className="text-xs text-gray-500 mt-1">{subject.length}/100 characters</p>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowDescription(!showDescription)}
                                        className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition"
                                    >
                                        {showDescription ? (
                                            <>
                                                <EyeOff className="w-4 h-4" />
                                                Hide preview
                                            </>
                                        ) : (
                                            <>
                                                <Eye className="w-4 h-4" />
                                                Preview
                                            </>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={loading}
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-gray-50 hover:bg-white"
                                    placeholder="Describe your issue in detail. The more information you provide, the better we can help..."
                                    maxLength={1000}
                                />
                                <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
                            </div>

                            {/* Duplicate Check Alert */}
                            {description.length > 10 && !isDaplicate && (
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-900 mb-3">
                                        🔍 <strong>AI Duplicate Detection:</strong> Before submitting, check if your complaint is unique in our system.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={checkForDuplicate}
                                        disabled={checkingDuplicate || loading}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {checkingDuplicate ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin" />
                                                Checking...
                                            </>
                                        ) : (
                                            '🔎 Check for Duplicates'
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Duplicate Status */}
                            {isDaplicate && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-900 mb-2">
                                            ⚠️ Duplicate Alert!
                                        </p>
                                        <p className="text-sm text-yellow-800">
                                            Our NLP engine detected that this complaint is very similar to an existing one (similarity score: 80%+).
                                            You can modify your description and check again, or contact support for more specific assistance.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="border-t border-gray-200 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading || isDaplicate}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 text-white ${
                                        isDaplicate
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                                    } ${loading ? 'opacity-70' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : isDaplicate ? (
                                        <>
                                            <AlertCircle className="w-5 h-5" />
                                            Cannot Submit (Duplicate)
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit Complaint
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                    <div>🤖 <strong>AI-Powered:</strong> TF-IDF + Cosine Similarity</div>
                    <div>📊 <strong>Transparent:</strong> See duplicate detection in action</div>
                    <div>⚡ <strong>Instant:</strong> Real-time analysis</div>
                </div>
            </div>
        </div>
    );
};

export default Complaint;
