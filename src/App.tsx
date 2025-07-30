import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import PDFs from './pages/PDFs';
import Passwords from './pages/Passwords';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Creator from './pages/Creator';
import { ThemeProvider } from './contexts/ThemeContext';
import { incrementUserCount } from './utils/userCounter';

function App() {
  useEffect(() => {
    // Increment user count when app loads
    incrementUserCount();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/links" element={<Links />} />
              <Route path="/pdfs" element={<PDFs />} />
              <Route path="/passwords" element={<Passwords />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/creator" element={<Creator />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;