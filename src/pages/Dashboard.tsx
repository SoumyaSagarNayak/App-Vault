import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  FileText, 
  Lock, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  Target,
  Clock,
  Zap
} from 'lucide-react';
import { getDailyQuote } from '../utils/quotes';

const Dashboard: React.FC = () => {
  const quote = getDailyQuote();
  
  // Get stats from localStorage
  const links = JSON.parse(localStorage.getItem('app-vault-links') || '[]');
  const pdfs = JSON.parse(localStorage.getItem('app-vault-pdfs') || '[]');
  const passwords = JSON.parse(localStorage.getItem('app-vault-passwords') || '[]');
  const tasks = JSON.parse(localStorage.getItem('app-vault-tasks') || '[]');
  const completedTasks = tasks.filter((task: any) => task.completed);
  const streak = parseInt(localStorage.getItem('task-streak') || '0');

  const stats = [
    { label: 'Saved Links', value: links.length, icon: LinkIcon, color: 'blue', path: '/links' },
    { label: 'PDF Documents', value: pdfs.length, icon: FileText, color: 'green', path: '/pdfs' },
    { label: 'Stored Passwords', value: passwords.length, icon: Lock, color: 'purple', path: '/passwords' },
    { label: 'Active Tasks', value: tasks.length - completedTasks.length, icon: CheckSquare, color: 'orange', path: '/tasks' },
  ];

  const quickActions = [
    { label: 'View Calendar', icon: Calendar, path: '/calendar', description: 'Track your daily progress' },
    { label: 'Add Task', icon: Target, path: '/tasks', description: 'Create a new task' },
    { label: 'Quick Link', icon: LinkIcon, path: '/links', description: 'Save a new link' },
    { label: 'Upload PDF', icon: FileText, path: '/pdfs', description: 'Store a document' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to App Vault</h1>
            <p className="text-blue-100 mb-6">Your personal productivity and storage companion</p>
            
            {/* Daily Quote */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 md:mb-6">
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium mb-1">Daily Motivation</p>
                  <p className="text-blue-100 italic text-sm md:text-base">"{quote.text}"</p>
                  <p className="text-blue-200 text-sm mt-2">- {quote.author}</p>
                </div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Current Streak</p>
                  <p className="text-xl md:text-2xl font-bold">{streak} days</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Completed Today</p>
                  <p className="text-xl md:text-2xl font-bold">{completedTasks.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden xl:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Lock className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.path}>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-4 md:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex items-center space-x-3 p-3 md:p-4 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm group-hover:shadow-md transition-shadow">
                <action.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-slate-900 dark:text-white">{action.label}</p>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Welcome to App Vault!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Start by creating your first entry</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;