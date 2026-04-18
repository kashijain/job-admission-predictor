import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if token is still valid
    const isTokenExpired = useCallback((token) => {
        try {
            if (!token) return true;
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (err) {
            return true;
        }
    }, []);

    // Initialize user from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            if (isTokenExpired(token)) {
                // Token expired, clear storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } else {
                try {
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        setUser(JSON.parse(userData));
                    }
                } catch (err) {
                    console.error('Error loading user from storage:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
        }
        setLoading(false);
    }, [isTokenExpired]);

    const login = useCallback((token, userData) => {
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setError(null);
            console.log('✓ User logged in:', userData.email);
        } catch (err) {
            setError('Failed to save login data');
            console.error('Login error:', err);
        }
    }, []);

    const logout = useCallback(() => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError(null);
            console.log('✓ User logged out');
        } catch (err) {
            setError('Failed to logout');
            console.error('Logout error:', err);
        }
    }, []);

    const value = {
        user,
        login,
        logout,
        loading,
        error,
        isAuthenticated: !!user,
        isTokenExpired,
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
