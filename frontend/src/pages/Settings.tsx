import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#FCA311');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setName(parsedUser.name || '');
    setEmail(parsedUser.email || '');
  }, [navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = { ...user, name, email, phone };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p style={{ color: '#14213D' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b sticky top-0 bg-white z-50" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h1 className="text-2xl font-extrabold" style={{ color: '#FCA311' }}>FinVerse</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium hover:underline" style={{ color: '#14213D' }}>
            ← Dashboard
          </Link>
          <button onClick={handleLogout} className="text-sm font-medium hover:underline cursor-pointer" style={{ color: '#EF4444', background: 'none', border: 'none' }}>
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold" style={{ color: '#000000' }}>⚙️ Settings</h2>
          <p className="text-sm mt-1" style={{ color: '#14213D' }}>Manage your account preferences</p>
        </div>

        {saved && (
          <div className="fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 flex items-center gap-2" style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}>
            ✅ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Profile */}
          <div className="p-6 rounded-xl border" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>👤 Profile Information</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: '#14213D', border: '3px solid #FCA311' }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium" style={{ color: '#FCA311' }}>
                {user.email}
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none text-base"
                style={{ borderColor: '#E5E5E5', color: '#000000', backgroundColor: '#FFFFFF' }}
                onFocus={(e) => (e.target.style.borderColor = '#FCA311')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border outline-none text-base opacity-70"
                style={{ borderColor: '#E5E5E5', color: '#000000', backgroundColor: '#F5F5F5' }}
              />
              <span className="text-xs mt-1 inline-block" style={{ color: '#10B981' }}>🔒 Verified ✓</span>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 rounded-xl border outline-none text-base"
                style={{ borderColor: '#E5E5E5', color: '#000000', backgroundColor: '#FFFFFF' }}
                onFocus={(e) => (e.target.style.borderColor = '#FCA311')}
                onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#14213D' }}>Default Currency</label>
              <select className="w-full px-4 py-3 rounded-xl border outline-none text-base cursor-pointer" style={{ borderColor: '#E5E5E5', color: '#000000', backgroundColor: '#FFFFFF' }}>
                <option>🇮🇳 INR (₹)</option>
                <option>🇺🇸 USD ($)</option>
                <option>🇪🇺 EUR (€)</option>
                <option>🇬🇧 GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6 rounded-xl border" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>🎨 Appearance</h3>
            
            <div className="mb-6">
              <p className="text-sm font-semibold mb-3" style={{ color: '#14213D' }}>Theme Mode</p>
              <div className="flex gap-3">
                {[
                  { value: 'light', icon: '☀️', label: 'Light Mode' },
                  { value: 'dark', icon: '🌙', label: 'Dark Mode' },
                  { value: 'system', icon: '💻', label: 'System Default' },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className="flex-1 p-4 rounded-xl border text-center transition cursor-pointer"
                    style={{
                      borderColor: theme === t.value ? '#FCA311' : '#E5E5E5',
                      backgroundColor: theme === t.value ? '#FFF8F0' : '#FFFFFF',
                      borderWidth: theme === t.value ? '2px' : '1px',
                    }}
                  >
                    <span className="text-2xl block mb-1">{t.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#14213D' }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3" style={{ color: '#14213D' }}>Accent Color</p>
              <div className="flex gap-3">
                {['#FCA311', '#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    className="w-10 h-10 rounded-full transition cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: color,
                      border: accentColor === color ? '3px solid #000000' : '3px solid transparent',
                      transform: accentColor === color ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {accentColor === color && <span className="text-white text-sm">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="p-6 rounded-xl border" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: '#000000' }}>🔒 Security</h3>
            
            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #E5E5E5' }}>
              <div>
                <p className="font-semibold" style={{ color: '#000000' }}>Change Password</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Update your password regularly</p>
              </div>
              <span className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: '#64748B', backgroundColor: '#F5F5F5' }}>
                Coming Soon
              </span>
            </div>

            <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #E5E5E5' }}>
              <div>
                <p className="font-semibold" style={{ color: '#000000' }}>Two-Factor Authentication</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Add extra security to your account</p>
              </div>
              <span className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: '#64748B', backgroundColor: '#F5F5F5' }}>
                Coming Soon
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold" style={{ color: '#000000' }}>Active Sessions</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Manage your logged-in devices</p>
              </div>
              <span className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ color: '#64748B', backgroundColor: '#F5F5F5' }}>
                Current Session
              </span>
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#FCA311' }}
          >
            💾 Save Changes
          </button>

        </form>
      </main>
    </div>
  );
}

export default Settings;