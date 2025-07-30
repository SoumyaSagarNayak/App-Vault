import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Link as LinkIcon, Github, Linkedin, Twitter, Instagram, Mail, Globe } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    email: string;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      website: '',
      email: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('app-vault-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('app-vault-profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    website: Globe,
    email: Mail
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your personal information and social links</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(profile.name)}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 pb-8 px-8">
          <div className="text-center mb-8">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-center text-2xl font-bold bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-white w-full max-w-xs"
                />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="text-center text-slate-600 dark:text-slate-400 bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-blue-500 outline-none w-full max-w-xs"
                />
                <textarea
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full max-w-md mx-auto mt-4 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.name || 'Your Name'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {profile.email || 'your.email@example.com'}
                </p>
                {profile.bio && (
                  <p className="text-slate-700 dark:text-slate-300 mt-4 max-w-md mx-auto">
                    {profile.bio}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {Object.entries(socialIcons).map(([key, Icon]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  {isEditing ? (
                    <input
                      type={key === 'email' ? 'email' : 'url'}
                      placeholder={`Your ${key} ${key === 'email' ? 'address' : 'URL'}`}
                      value={profile.socialLinks[key as keyof typeof profile.socialLinks]}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: {
                          ...profile.socialLinks,
                          [key]: e.target.value
                        }
                      })}
                      className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white capitalize">{key}</p>
                      {profile.socialLinks[key as keyof typeof profile.socialLinks] ? (
                        <a
                          href={key === 'email' 
                            ? `mailto:${profile.socialLinks[key as keyof typeof profile.socialLinks]}`
                            : profile.socialLinks[key as keyof typeof profile.socialLinks]
                          }
                          target={key === 'email' ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm truncate block"
                        >
                          {profile.socialLinks[key as keyof typeof profile.socialLinks]}
                        </a>
                      ) : (
                        <p className="text-slate-400 dark:text-slate-500 text-sm">Not provided</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Links Saved', value: JSON.parse(localStorage.getItem('app-vault-links') || '[]').length },
          { label: 'PDFs Stored', value: JSON.parse(localStorage.getItem('app-vault-pdfs') || '[]').length },
          { label: 'Passwords Saved', value: JSON.parse(localStorage.getItem('app-vault-passwords') || '[]').length },
          { label: 'Tasks Created', value: JSON.parse(localStorage.getItem('app-vault-tasks') || '[]').length },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;