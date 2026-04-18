import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PredictionForm from './pages/PredictionForm';
import BTechForm from './pages/BTechForm';
import Result from './pages/Result';
import Complaint from './pages/Complaint';
import Admin from './pages/Admin';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

const PrivateRoute = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);
    
    if (!user) return <Navigate to="/login" />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
    
    return children;
};


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    <Route path="/predict/:type" element={
                        <PrivateRoute>
                            <PredictionForm />
                        </PrivateRoute>
                    } />
                    <Route path="/predict/btech" element={
                        <PrivateRoute>
                            <BTechForm />
                        </PrivateRoute>
                    } />
                    <Route path="/result" element={
                        <PrivateRoute>
                            <Result />
                        </PrivateRoute>
                    } />
                    <Route path="/complaint" element={
                        <PrivateRoute>
                            <Complaint />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/tools/resume" element={
                        <PrivateRoute>
                            <ResumeAnalyzer />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/admin" element={
                        <PrivateRoute requiredRole="admin">
                            <Admin />
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
