import React from 'react';
import { Github, Linkedin, Mail, Instagram, ExternalLink, Code, Heart, Coffee } from 'lucide-react';
import { getUserCount } from '../utils/userCounter';

const Creator: React.FC = () => {
  const userCount = getUserCount();
  
  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/SoumyaSagarNayak',
      icon: Github,
      description: 'Check out my open source projects and contributions',
      color: 'bg-gray-900 hover:bg-gray-800'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/soumya-sagar-nayak-498352295',
      icon: Linkedin,
      description: 'Connect with me professionally',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Email',
      url: 'mailto:soumyasagarnayak351@gmail.com',
      icon: Mail,
      description: 'Get in touch for collaborations and opportunities',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/ice_soum',
      icon: Instagram,
      description: 'Follow my journey and behind-the-scenes content',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
    }
  ];

  const stats = [
    { label: 'Total Users', value: userCount.toLocaleString(), icon: '👥' },
    { label: 'Features Built', value: '8', icon: '⚡' },
    { label: 'Lines of Code', value: '2.5K+', icon: '💻' },
    { label: 'Coffee Consumed', value: '∞', icon: '☕' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center">
        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
          <Code className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Meet the Creator</h1>
        <p className="text-xl text-blue-100 mb-2">Soumya Sagar Nayak</p>
        <p className="text-blue-200 max-w-2xl mx-auto">
          Passionate full-stack developer crafting beautiful and functional web applications. 
          App Vault is designed to be your ultimate productivity companion with security and 
          user experience at its core.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Heart className="w-6 h-6 text-red-500 mr-3" />
          About App Vault
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4">
            App Vault was born from the need for a secure, all-in-one productivity solution. 
            As a developer, I found myself juggling multiple tools for different purposes - 
            bookmark managers, password managers, note-taking apps, and task trackers.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4">
            I wanted to create something that brings all these essential tools together in 
            one beautiful, secure, and user-friendly interface. App Vault features end-to-end 
            encryption for passwords, beautiful data visualizations, and a clean design that 
            makes productivity enjoyable.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-6">
            <div className="flex items-center mb-3">
              <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Built with Love and Coffee</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Every feature in App Vault has been carefully crafted with attention to detail. 
              From the smooth animations to the secure encryption, everything is designed to 
              provide you with the best possible experience.
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Let's Connect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex items-center space-x-4">
                <link.icon className="w-8 h-8" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{link.name}</h3>
                  <p className="text-sm opacity-90">{link.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Built With Modern Technologies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'React', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
            { name: 'TypeScript', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
            { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
            { name: 'Vite', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
            { name: 'Lucide Icons', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
            { name: 'Recharts', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' }
          ].map((tech, index) => (
            <div
              key={index}
              className={`${tech.color} px-3 py-2 rounded-lg text-center font-medium text-sm`}
            >
              {tech.name}
            </div>
          ))}
        </div>
      </div>

      {/* Thank You Note */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You for Using App Vault! 🎉</h2>
        <p className="text-green-100 mb-4">
          Your support and feedback help make App Vault better every day. 
          Join {userCount.toLocaleString()} other users who trust App Vault with their productivity needs.
        </p>
        <p className="text-green-200">
          Have suggestions or found a bug? Feel free to reach out through any of the channels above!
        </p>
      </div>
      
      {/* GitHub Star Badge */}
      <div className="mt-6 flex justify-center">
        <a
          href="https://github.com/SoumyaSagarNayak"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="font-medium text-sm sm:text-base">⭐ Star on GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default Creator;