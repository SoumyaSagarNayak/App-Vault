import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Download, Edit, Trash2, Upload, Tag, FolderOpen } from 'lucide-react';

interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  description: string;
  tags: string[];
  category: string;
  createdAt: string;
  fileData: string; // Base64 data
}

const PDFs: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDF | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'general'
  });

  const categories = ['general', 'work', 'education', 'personal', 'reference', 'invoices'];

  useEffect(() => {
    const savedPdfs = localStorage.getItem('app-vault-pdfs');
    if (savedPdfs) {
      setPdfs(JSON.parse(savedPdfs));
    }
  }, []);

  const savePdfs = (updatedPdfs: PDF[]) => {
    setPdfs(updatedPdfs);
    localStorage.setItem('app-vault-pdfs', JSON.stringify(updatedPdfs));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        title: prev.title || file.name.replace('.pdf', ''),
      }));
      
      // Store file data for the upload
      (window as any).uploadedFile = {
        data: result,
        name: file.name,
        size: formatFileSize(file.size)
      };
      
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPdf && !(window as any).uploadedFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    const pdfData: PDF = {
      id: editingPdf?.id || Date.now().toString(),
      title: formData.title,
      fileName: editingPdf?.fileName || (window as any).uploadedFile.name,
      fileSize: editingPdf?.fileSize || (window as any).uploadedFile.size,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: formData.category,
      createdAt: editingPdf?.createdAt || new Date().toISOString(),
      fileData: editingPdf?.fileData || (window as any).uploadedFile.data
    };

    if (editingPdf) {
      const updatedPdfs = pdfs.map(pdf => pdf.id === editingPdf.id ? pdfData : pdf);
      savePdfs(updatedPdfs);
    } else {
      savePdfs([...pdfs, pdfData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', tags: '', category: 'general' });
    setIsModalOpen(false);
    setEditingPdf(null);
    (window as any).uploadedFile = null;
  };

  const handleEdit = (pdf: PDF) => {
    setEditingPdf(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      tags: pdf.tags.join(', '),
      category: pdf.category
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this PDF?')) {
      const updatedPdfs = pdfs.filter(pdf => pdf.id !== id);
      savePdfs(updatedPdfs);
    }
  };

  const handleDownload = (pdf: PDF) => {
    const link = document.createElement('a');
    link.href = pdf.fileData;
    link.download = pdf.fileName;
    link.click();
  };

  const filteredPdfs = pdfs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pdf.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PDF Vault</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Upload and organize your PDF documents</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Upload PDF</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search PDFs..."
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

      {/* PDFs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPdfs.map(pdf => (
          <div key={pdf.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {pdf.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {pdf.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleDownload(pdf)}
                  className="p-1 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(pdf)}
                  className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pdf.id)}
                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
              {pdf.description || 'No description provided'}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {pdf.category}
              </span>
              {pdf.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {pdf.fileName}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(pdf.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        
        {filteredPdfs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No PDFs found</h3>
            <p className="text-slate-600 dark:text-slate-400">Upload your first PDF document!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              {editingPdf ? 'Edit PDF' : 'Upload New PDF'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingPdf && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    PDF File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {uploading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Upload className="w-4 h-4 text-blue-600 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="document, invoice, report"
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
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  {editingPdf ? 'Update' : 'Upload'} PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFs;