import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: '#FFF8F0' }}>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#FCA311' }}></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-10 animate-bounce" style={{ backgroundColor: '#FCA311', animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full opacity-10 animate-ping" style={{ backgroundColor: '#14213D', animationDuration: '3s' }}></div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-10 z-10">
        
        <div className="hidden md:block animate-bounce relative" style={{ animationDuration: '3s', marginTop: '-60px' }}>
          <div className="absolute -inset-10 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#FCA311' }}></div>
          
          <div className="text-center relative z-10">
            <div className="relative w-48 h-56 mx-auto">
              <div className="w-24 h-24 rounded-full mx-auto relative" style={{ backgroundColor: '#FCA311' }}>
                <div className="absolute top-7 left-5 w-3 h-3 bg-black rounded-full"></div>
                <div className="absolute top-7 right-5 w-3 h-3 bg-black rounded-full"></div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-4 border-b-3 border-black rounded-b-full"></div>
              </div>
              <div className="w-20 h-28 rounded-t-3xl mx-auto -mt-1 relative" style={{ backgroundColor: '#14213D' }}>
                <div className="absolute -left-8 top-4 w-8 h-16 rounded-full animate-pulse" style={{ backgroundColor: '#14213D' }}></div>
                <div className="absolute -right-8 top-4 w-8 h-16 rounded-full animate-pulse" style={{ backgroundColor: '#14213D' }}></div>
              </div>
              <div className="flex justify-center gap-4 -mt-1">
                <div className="w-6 h-16 rounded-b-xl" style={{ backgroundColor: '#FCA311' }}></div>
                <div className="w-6 h-16 rounded-b-xl" style={{ backgroundColor: '#FCA311' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md p-8 rounded-2xl border bg-white shadow-xl" style={{ borderColor: '#E5E5E5' }}>
          
          <Link to="/" className="text-sm font-medium hover:underline mb-6 inline-block" style={{ color: '#FCA311' }}>
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-extrabold mb-1" style={{ color: '#000000' }}>
            👋 Welcome Back!
          </h1>
          <p className="mb-8" style={{ color: '#14213D' }}>
            Sign in to your FinVerse account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border text-base outline-none transition"
                style={{
                  borderColor: '#E5E5E5',
                  color: '#000000',
                  backgroundColor: '#FFFFFF',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#FCA311')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl border text-base outline-none transition pr-12"
                  style={{
                    borderColor: '#E5E5E5',
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#FCA311')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer"
                  style={{ background: 'none', border: 'none' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#14213D' }}>
                <input type="checkbox" className="w-4 h-4 accent-[#FCA311]" />
                Remember me
              </label>
              <a href="#" className="font-medium hover:underline" style={{ color: '#FCA311' }}>
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm font-medium text-center" style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: '#FCA311' }}
            >
              {loading ? 'Signing in...' : '🚀 Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1" style={{ borderColor: '#E5E5E5' }} />
            <span className="text-sm" style={{ color: '#14213D' }}>OR</span>
            <hr className="flex-1" style={{ borderColor: '#E5E5E5' }} />
          </div>

          <button
            type="button"
            className="w-full py-3 rounded-xl border font-semibold text-base flex items-center justify-center gap-3 transition hover:bg-gray-50 cursor-pointer"
            style={{ borderColor: '#E5E5E5', color: '#14213D', backgroundColor: '#FFFFFF' }}
          >
            <span className="text-xl">G</span> Sign in with Google
          </button>

          <p className="text-center mt-6 text-sm" style={{ color: '#14213D' }}>
            New to FinVerse?{' '}
            <Link to="/signup" className="font-bold hover:underline" style={{ color: '#FCA311' }}>
              ✨ Create New Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;