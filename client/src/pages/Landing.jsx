import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Share2, Lock, Sparkles } from 'lucide-react';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-secondary-600 text-white p-12 flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Notes Share</h1>
          </div>

          <p className="text-xl mb-12 text-primary-100">
            Your personal notes platform for sharing ideas with friends
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Beautiful & Modern</h3>
                <p className="text-primary-100">
                  Clean, elegant interface with dark mode support
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Easy Sharing</h3>
                <p className="text-primary-100">
                  Share notes with friends and collaborate in real-time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                <p className="text-primary-100">
                  Your notes are encrypted and protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FileText className="w-10 h-10 text-primary-600" />
              <h1 className="text-3xl font-bold">Notes Share</h1>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                    placeholder="johndoe"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
