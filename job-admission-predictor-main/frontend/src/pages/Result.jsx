import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { ArrowLeft, CheckCircle, XCircle, Share2, Download, BarChart3, Award, Briefcase, Target } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Result = () => {
    const { state } = useLocation();
    
    if (!state) return <Navigate to="/dashboard" />;
    
    const { 
        type, 
        probability, 
        message, 
        result,
        collegeTier,
        safeColleges,
        moderateColleges,
        ambitiousColleges,
        recommendationSummary
    } = state;
    const isJob = type === 'job';
    
    const isSuccess = probability >= 50;

    const modelInfo = isJob ? {
        modelName: 'Random Forest Classifier',
        modelIcon: '🌲',
        description: 'Ensemble learning model using multiple decision trees',
        accuracy: '85-90%',
        features: 'Age, Gender, Stream, Internships, CGPA, Hostel, Backlogs, Skill, Projects',
        color: 'blue'
    } : {
        modelName: 'Logistic Regression',
        modelIcon: '📈',
        description: 'Statistical probability model for binary classification',
        accuracy: '78-82%',
        features: 'Academic performance & project-based heuristics',
        color: 'purple'
    };

    const doughnutData = {
        labels: ['Success Probability', 'Remaining'],
        datasets: [
            {
                data: [probability, 100 - probability],
                backgroundColor: [isSuccess ? '#10b981' : '#ef4444', '#e5e7eb'],
                borderWidth: 0,
                borderRadius: 8,
            },
        ],
    };

    const barData = {
        labels: ['Your Score', 'Average', 'Target'],
        datasets: [
            {
                label: 'Probability %',
                data: [probability, 50, 80],
                backgroundColor: [
                    isSuccess ? '#3b82f6' : '#d97706',
                    '#6b7280',
                    '#10b981'
                ],
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Main Result Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${isJob ? 'from-blue-600 to-blue-700' : 'from-purple-600 to-indigo-600'} px-8 py-12 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Prediction Result</h1>
                                <p className="text-white text-opacity-90">
                                    {isJob ? 'Job Placement Analysis' : 'M.Tech Admission Analysis'}
                                </p>
                            </div>
                            <div className="text-5xl">
                                {isSuccess ? '✅' : '⚠️'}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Result Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Left: Chart */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full max-w-xs">
                                    <Doughnut
                                        data={doughnutData}
                                        options={{
                                            maintainAspectRatio: true,
                                            cutout: '70%',
                                            plugins: {
                                                legend: { display: false }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600 text-sm mb-2">Success Probability</p>
                                    <p className="text-5xl font-black text-gray-900">{probability}%</p>
                                </div>
                            </div>

                            {/* Right: Status Info */}
                            <div className="flex flex-col justify-center space-y-6">
                                {/* Status Badge */}
                                <div className={`p-6 rounded-xl ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {isSuccess ? (
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        ) : (
                                            <XCircle className="w-8 h-8 text-orange-600" />
                                        )}
                                        <h3 className={`text-xl font-bold ${isSuccess ? 'text-green-900' : 'text-orange-900'}`}>
                                            {message}
                                        </h3>
                                    </div>
                                    <p className={`text-sm ${isSuccess ? 'text-green-700' : 'text-orange-700'}`}>
                                        {isSuccess
                                            ? 'Based on your profile, you have a strong likelihood of achieving your goal.'
                                            : 'Based on your profile, you may need to improve certain areas. Keep working on your skills!'}
                                    </p>
                                </div>

                                {/* Insights */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-900">Quick Insights:</h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>Your score is <strong>{probability >= 70 ? 'excellent' : probability >= 50 ? 'good' : 'needs improvement'}</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>Average candidate score: <strong>50%</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                            <span>Recommended target: <strong>70%+</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-8"></div>

                        {/* ML Model Information */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Machine Learning Model Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Model Info Card */}
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl">{modelInfo.modelIcon}</span>
                                        <h4 className="font-bold text-gray-900">{modelInfo.modelName}</h4>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4">{modelInfo.description}</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-700">
                                            <span className="font-semibold text-gray-900">Model Accuracy:</span> {modelInfo.accuracy}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold text-gray-900">Features Analyzed:</span> {modelInfo.features}
                                        </p>
                                    </div>
                                </div>

                                {/* Comparative Chart */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-4">Comparative Analysis</h4>
                                    <Bar
                                        data={barData}
                                        options={{
                                            indexAxis: 'y',
                                            maintainAspectRatio: true,
                                            plugins: { legend: { display: false } },
                                            scales: { x: { beginAtZero: true, max: 100 } }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                            <h3 className="font-bold text-blue-900 mb-4">📋 Recommendations to Improve</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                                    <span className="text-blue-900">Maintain or improve your CGPA consistently</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                                    <span className="text-blue-900">Participate in internships and projects</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                                    <span className="text-blue-900">Develop technical skills in programming</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                                    <span className="text-blue-900">Avoid backlogs or clear them immediately</span>
                                </li>
                            </ul>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-8"></div>

                        {/* Possible Colleges Section (only for M.Tech admission) */}
                        {!isJob && collegeTier && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-purple-600" />
                                    Possible Colleges & Institutions
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">{recommendationSummary}</p>

                                {/* College Tier Badge */}
                                <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                                    <p className="text-sm text-gray-600 mb-2">Your Expected College Tier:</p>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {collegeTier}
                                        {collegeTier === 'Tier 1' && ' 🏆 - Premium Institutes'}
                                        {collegeTier === 'Tier 2' && ' ⭐ - Very Good Institutes'}
                                        {collegeTier === 'Tier 3' && ' ✨ - Good Regional Institutes'}
                                    </p>
                                </div>

                                {/* College Recommendations Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Safe Options */}
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <h4 className="font-bold text-green-900">Safe Options</h4>
                                        </div>
                                        <p className="text-xs text-green-700 mb-4">High probability of admission</p>
                                        <div className="space-y-3">
                                            {safeColleges && safeColleges.length > 0 ? (
                                                safeColleges.map((college, idx) => (
                                                    <div key={idx} className="p-3 bg-white rounded-lg border border-green-100">
                                                        <p className="font-semibold text-sm text-green-900">{college.abbreviation}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{college.reason}</p>
                                                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                            {college.tier}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600">No recommendations available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Moderate Options */}
                                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Target className="w-6 h-6 text-yellow-600" />
                                            <h4 className="font-bold text-yellow-900">Moderate Options</h4>
                                        </div>
                                        <p className="text-xs text-yellow-700 mb-4">Competitive but achievable</p>
                                        <div className="space-y-3">
                                            {moderateColleges && moderateColleges.length > 0 ? (
                                                moderateColleges.map((college, idx) => (
                                                    <div key={idx} className="p-3 bg-white rounded-lg border border-yellow-100">
                                                        <p className="font-semibold text-sm text-yellow-900">{college.abbreviation}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{college.reason}</p>
                                                        <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                            {college.tier}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600">No recommendations available</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ambitious Options */}
                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Briefcase className="w-6 h-6 text-blue-600" />
                                            <h4 className="font-bold text-blue-900">Ambitious Options</h4>
                                        </div>
                                        <p className="text-xs text-blue-700 mb-4">Stretch goals - worth trying</p>
                                        <div className="space-y-3">
                                            {ambitiousColleges && ambitiousColleges.length > 0 ? (
                                                ambitiousColleges.map((college, idx) => (
                                                    <div key={idx} className="p-3 bg-white rounded-lg border border-blue-100">
                                                        <p className="font-semibold text-sm text-blue-900">{college.abbreviation}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{college.reason}</p>
                                                        <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                            {college.tier}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-600">No recommendations available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-700">
                                        💡 <strong>Tip:</strong> These recommendations are based on your CGPA, internships, projects, and GATE score (if applicable). 
                                        Apply to colleges across all three categories to maximize your chances. 
                                        Safe colleges ensure you have backup options, while ambitious colleges are worth the try!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition font-medium flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Dashboard
                            </button>
                            <button
                                onClick={handlePrint}
                                className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Report
                            </button>
                            <button
                                onClick={() => navigator.share && navigator.share({ title: 'My Result', text: `I got ${probability}% on the ${isJob ? 'Job' : 'Admission'} prediction!` })}
                                className="py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-medium flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-5 h-5" />
                                Share Result
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-8">
                    💡 This prediction is based on ML analysis and historical data. Actual results may vary.
                </p>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body { background: white; }
                    .nonprint { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Result;
