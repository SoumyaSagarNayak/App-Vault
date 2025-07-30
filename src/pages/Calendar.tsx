import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths, getYear, setYear, setMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, Calendar as CalendarIcon, Target, CheckSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Get activity data from localStorage
  const getActivityData = () => {
    const links = JSON.parse(localStorage.getItem('app-vault-links') || '[]');
    const pdfs = JSON.parse(localStorage.getItem('app-vault-pdfs') || '[]');
    const passwords = JSON.parse(localStorage.getItem('app-vault-passwords') || '[]');
    const tasks = JSON.parse(localStorage.getItem('app-vault-tasks') || '[]');
    
    const activityMap = new Map();
    
    // Process all data and group by date
    [...links, ...pdfs, ...passwords, ...tasks].forEach(item => {
      const date = item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      if (!activityMap.has(date)) {
        activityMap.set(date, { links: 0, pdfs: 0, passwords: 0, tasks: 0, completed: 0 });
      }
      
      const activity = activityMap.get(date);
      if (links.includes(item)) activity.links++;
      else if (pdfs.includes(item)) activity.pdfs++;
      else if (passwords.includes(item)) activity.passwords++;
      else if (tasks.includes(item)) {
        activity.tasks++;
        if (item.completed) activity.completed++;
      }
    });
    
    return activityMap;
  };

  const activityData = getActivityData();

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Generate chart data for the current month
  const chartData = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const activity = activityData.get(dateKey) || { links: 0, pdfs: 0, passwords: 0, tasks: 0, completed: 0 };
      const total = activity.links + activity.pdfs + activity.passwords + activity.tasks;
      
      return {
        date: format(day, 'MMM dd'),
        total,
        completed: activity.completed,
        links: activity.links,
        pdfs: activity.pdfs,
        passwords: activity.passwords,
        tasks: activity.tasks,
      };
    });
  }, [currentDate, activityData]);

  const getActivityLevel = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const activity = activityData.get(dateKey) || { links: 0, pdfs: 0, passwords: 0, tasks: 0, completed: 0 };
    const total = activity.links + activity.pdfs + activity.passwords + activity.tasks;
    
    if (total === 0) return 'bg-slate-100 dark:bg-slate-700';
    if (total <= 2) return 'bg-green-200 dark:bg-green-800';
    if (total <= 5) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-600 dark:bg-green-400';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
    setShowYearPicker(false);
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(setMonth(currentDate, month));
    setShowMonthPicker(false);
  };

  const getDayActivity = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return activityData.get(dateKey) || { links: 0, pdfs: 0, passwords: 0, tasks: 0, completed: 0 };
  };

  const totalActivity = chartData.reduce((sum, day) => sum + day.total, 0);
  const totalCompleted = chartData.reduce((sum, day) => sum + day.completed, 0);
  const avgDaily = totalActivity / chartData.length || 0;

  const currentYear = getYear(currentDate);
  const currentMonth = currentDate.getMonth();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your daily productivity and progress</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">This Month</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{totalActivity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Activities</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalActivity}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tasks Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCompleted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Daily Average</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgDaily.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Activity Trend */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-color-slate-800)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                fill="url(#gradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Task Completion</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-color-slate-800)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="text-xl font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {format(currentDate, 'MMMM')}
            </button>
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="text-xl font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {format(currentDate, 'yyyy')}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Year Picker */}
        {showYearPicker && (
          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="grid grid-cols-5 gap-2">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    year === currentYear
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-500'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Month Picker */}
        {showMonthPicker && (
          <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthChange(index)}
                  className={`p-2 rounded text-sm font-medium transition-colors ${
                    index === currentMonth
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-500'
                  }`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map(day => {
            const activity = getDayActivity(day);
            const total = activity.links + activity.pdfs + activity.passwords + activity.tasks;
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <div
                key={day.toISOString()}
                className={`relative p-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  isCurrentMonth ? 'opacity-100' : 'opacity-40'
                } ${
                  isToday(day) ? 'ring-2 ring-blue-500' : ''
                } ${
                  isSelected ? 'ring-2 ring-purple-500' : ''
                } ${getActivityLevel(day)}`}
                onClick={() => setSelectedDate(day)}
                title={`${format(day, 'MMM dd')}: ${total} activities, ${activity.completed} completed tasks`}
              >
                <div className="text-center">
                  <span className={`text-xs sm:text-sm font-medium ${
                    isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {total > 0 && (
                    <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
            <span>No activity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Activity for {format(selectedDate, 'MMMM dd, yyyy')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(getDayActivity(selectedDate)).map(([key, value]) => (
              <div key={key} className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{value as number}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;