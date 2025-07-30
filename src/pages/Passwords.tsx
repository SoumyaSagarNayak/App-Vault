import React, { useState, useEffect } from 'react';
import { Plus, Search, Lock, Eye, EyeOff, Copy, Check, Edit, Trash2, Shield, AlertTriangle } from 'lucide-react';
import CryptoJS from 'crypto-js';

interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: string;
  createdAt: string;
}

const Passwords: React.FC = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [masterKey, setMasterKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    website: '',
    notes: '',
    category: 'general'
  });

  const categories = ['general', 'social', 'work', 'banking', 'shopping', 'entertainment'];
  const ENCRYPTION_KEY = 'app-vault-secret-key';

  useEffect(() => {
    // Check if passwords exist and require unlock
    const savedPasswords = localStorage.getItem('app-vault-passwords');
    if (savedPasswords && JSON.parse(savedPasswords).length > 0) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, []);

  const encrypt = (text: string): string => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  };

  const decrypt = (encryptedText: string): string => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return encryptedText; // Return as is if not encrypted (backward compatibility)
    }
  };

  const loadPasswords = () => {
    const savedPasswords = localStorage.getItem('app-vault-passwords');
    if (savedPasswords) {
      const parsedPasswords = JSON.parse(savedPasswords);
      const decryptedPasswords = parsedPasswords.map((pwd: Password) => ({
        ...pwd,
        password: decrypt(pwd.password)
      }));
      setPasswords(decryptedPasswords);
    }
  };

  const savePasswords = (updatedPasswords: Password[]) => {
    const encryptedPasswords = updatedPasswords.map(pwd => ({
      ...pwd,
      password: encrypt(pwd.password)
    }));
    setPasswords(updatedPasswords);
    localStorage.setItem('app-vault-passwords', JSON.stringify(encryptedPasswords));
  };

  const handleUnlock = () => {
    if (masterKey === 'vault123' || masterKey === '') { // Simple master key for demo
      setIsUnlocked(true);
      loadPasswords();
    } else {
      alert('Incorrect master key');
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600' };
    if (score <= 4) return { score, label: 'Medium', color: 'text-yellow-600' };
    return { score, label: 'Strong', color: 'text-green-600' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordData: Password = {
      id: editingPassword?.id || Date.now().toString(),
      title: formData.title,
      username: formData.username,
      password: formData.password,
      website: formData.website,
      notes: formData.notes,
      category: formData.category,
      createdAt: editingPassword?.createdAt || new Date().toISOString()
    };

    if (editingPassword) {
      const updatedPasswords = passwords.map(pwd => pwd.id === editingPassword.id ? passwordData : pwd);
      savePasswords(updatedPasswords);
    } else {
      savePasswords([...passwords, passwordData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', username: '', password: '', website: '', notes: '', category: 'general' });
    setIsModalOpen(false);
    setEditingPassword(null);
  };

  const handleEdit = (password: Password) => {
    setEditingPassword(password);
    setFormData({
      title: password.title,
      username: password.username,
      password: password.password,
      website: password.website,
      notes: password.notes,
      category: password.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this password?')) {
      const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
      savePasswords(updatedPasswords);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password Vault Locked</h2>
            <p className="text-slate-600 dark:text-slate-400">Enter your master key to access your passwords</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter master key (use 'vault123' for demo)"
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleUnlock}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors font-medium"
            >
              Unlock Vault
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Security Note</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Your passwords are encrypted using AES encryption. For demo purposes, use 'vault123' as master key.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Password Vault</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Securely store and manage your passwords</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUnlocked(false)}
            className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Vault</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Password</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Passwords Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPasswords.map(password => {
          const strength = getPasswordStrength(password.password);
          return (
            <div key={password.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {password.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {password.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(password)}
                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(password.id)}
                    className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Password</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 font-mono text-sm bg-slate-50 dark:bg-slate-700 rounded px-2 py-1">
                      {showPassword[password.id] ? password.password : '••••••••••••'}
                    </div>
                    <button
                      onClick={() => togglePasswordVisibility(password.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword[password.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCopy(password.password, password.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {copiedId === password.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs font-medium ${strength.color}`}>
                      {strength.label}
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-2 rounded ${
                            i < strength.score 
                              ? strength.score <= 2 ? 'bg-red-400' : strength.score <= 4 ? 'bg-yellow-400' : 'bg-green-400'
                              : 'bg-slate-200 dark:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {password.website && (
                  <div>
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Website</label>
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{password.website}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {password.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(password.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredPasswords.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No passwords found</h3>
            <p className="text-slate-600 dark:text-slate-400">Start by adding your first password!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {editingPassword ? 'Edit Password' : 'Add New Password'}
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
                  Username/Email
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Generate Password"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${getPasswordStrength(formData.password).color}`}>
                        Strength: {getPasswordStrength(formData.password).label}
                      </span>
                      <div className="flex space-x-1">
                        {[...Array(6)].map((_, i) => {
                          const strength = getPasswordStrength(formData.password);
                          return (
                            <div
                              key={i}
                              className={`w-1 h-2 rounded ${
                                i < strength.score 
                                  ? strength.score <= 2 ? 'bg-red-400' : strength.score <= 4 ? 'bg-yellow-400' : 'bg-green-400'
                                  : 'bg-slate-200 dark:bg-slate-600'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
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
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
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
                  {editingPassword ? 'Update' : 'Save'} Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Passwords;