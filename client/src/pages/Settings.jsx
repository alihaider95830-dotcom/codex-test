import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { updateProfile } from '../utils/api';
import Avatar from '../components/Avatar';
import { getInitials } from '../utils/helpers';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await updateProfile({
        username,
        email,
        theme,
      });
      updateUser(response.data);
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('success')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Profile</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  <Avatar user={user} size="xl" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Currently using initials: {getInitials(user?.username)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Appearance Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Appearance</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Theme
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-medium mb-1">Light</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Clean and bright
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-medium mb-1">Dark</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Easy on the eyes
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
