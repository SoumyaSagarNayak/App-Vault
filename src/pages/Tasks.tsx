import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckSquare, Square, Edit, Trash2, Calendar as CalendarIcon, Flag, Clock, Target, TrendingUp } from 'lucide-react';
import { format, isToday, isPast, addDays } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [streak, setStreak] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    category: 'general'
  });

  const categories = ['general', 'work', 'personal', 'health', 'learning', 'urgent'];
  const filters = ['all', 'pending', 'completed', 'overdue', 'today'];

  useEffect(() => {
    const savedTasks = localStorage.getItem('app-vault-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedStreak = localStorage.getItem('task-streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('app-vault-tasks', JSON.stringify(updatedTasks));
    updateStreak(updatedTasks);
  };

  const updateStreak = (updatedTasks: Task[]) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Check if any task was completed today
    const todayCompleted = updatedTasks.some(task => 
      task.completed && task.completedAt && 
      format(new Date(task.completedAt), 'yyyy-MM-dd') === todayStr
    );
    
    if (todayCompleted) {
      const yesterday = addDays(today, -1);
      const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
      
      // Check if tasks were completed yesterday too
      const yesterdayCompleted = updatedTasks.some(task =>
        task.completed && task.completedAt &&
        format(new Date(task.completedAt), 'yyyy-MM-dd') === yesterdayStr
      );
      
      if (yesterdayCompleted || streak === 0) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('task-streak', newStreak.toString());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      category: formData.category,
      completed: editingTask?.completed || false,
      completedAt: editingTask?.completedAt,
      createdAt: editingTask?.createdAt || new Date().toISOString()
    };

    if (editingTask) {
      const updatedTasks = tasks.map(task => task.id === editingTask.id ? taskData : task);
      saveTasks(updatedTasks);
    } else {
      saveTasks([...tasks, taskData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', dueDate: '', priority: 'medium', category: 'general' });
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
    }
  };

  const toggleComplete = (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    );
    saveTasks(updatedTasks);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const getTaskStatus = (task: Task) => {
    if (task.completed) return 'completed';
    if (isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) return 'overdue';
    if (isToday(new Date(task.dueDate))) return 'today';
    return 'pending';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getTaskStatus(task);
    let matchesFilter = true;
    
    if (selectedFilter === 'pending') matchesFilter = !task.completed;
    else if (selectedFilter === 'completed') matchesFilter = task.completed;
    else if (selectedFilter === 'overdue') matchesFilter = status === 'overdue';
    else if (selectedFilter === 'today') matchesFilter = status === 'today';
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => getTaskStatus(t) === 'overdue').length,
    today: tasks.filter(t => getTaskStatus(t) === 'today').length
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tasks</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your tasks and track your progress</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Today</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.today}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Streak</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{streak}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          {filters.map(filter => (
            <option key={filter} value={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map(task => {
          const status = getTaskStatus(task);
          const isOverdue = status === 'overdue';
          
          return (
            <div key={task.id} className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border transition-all hover:shadow-md ${
              task.completed 
                ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' 
                : isOverdue 
                  ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10'
                  : 'border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`mt-1 transition-colors ${
                    task.completed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {task.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${
                        task.completed 
                          ? 'line-through text-slate-500 dark:text-slate-400' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${
                          task.completed 
                            ? 'text-slate-400 dark:text-slate-500' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </span>
                      
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {task.category}
                      </span>
                      
                      {task.dueDate && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isOverdue 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : status === 'today'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {format(new Date(task.dueDate), 'MMM dd')}
                        </span>
                      )}
                    </div>
                    
                    {task.completed && task.completedAt && (
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Completed {format(new Date(task.completedAt), 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {selectedFilter === 'all' ? 'Start by adding your first task!' : `No ${selectedFilter} tasks found.`}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingTask ? 'Update' : 'Create'} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;