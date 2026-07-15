import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { expensesAPI, userAPI } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: '🍕 Food',
    date: new Date().toISOString().split('T')[0],
  });
  const [chartType, setChartType] = useState('bar');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [balance, setBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [newIncome, setNewIncome] = useState('');

  const colors = {
    bg: darkMode ? '#0F172A' : '#FFFFFF',
    cardBg: darkMode ? '#1E293B' : '#FFFFFF',
    text: darkMode ? '#F1F5F9' : '#000000',
    textSecondary: darkMode ? '#94A3B8' : '#14213D',
    border: darkMode ? '#334155' : '#E5E5E5',
    hover: darkMode ? '#334155' : '#F5F5F5',
    totalBg: darkMode ? '#1E293B' : '#FFF8F0',
    inputBg: darkMode ? '#1E293B' : '#FFFFFF',
    navBg: darkMode ? '#0F172A' : '#FFFFFF',
  };

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setBalance(data.balance || 0);
      setMonthlyIncome(data.monthlyIncome || 0);
      const userData = { ...JSON.parse(localStorage.getItem('user') || '{}'), balance: data.balance, monthlyIncome: data.monthlyIncome };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await expensesAPI.getAll();
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expensesAPI.delete(id);
        fetchExpenses();
        fetchProfile();
      } catch (err) {
        console.error('Failed to delete');
      }
    }
  };

  const handleEdit = async (id: string, expense: any) => {
    const newAmount = prompt('Enter new amount:', expense.amount);
    if (newAmount) {
      try {
        await expensesAPI.update(id, {
          amount: parseFloat(newAmount),
          description: expense.description,
          category: expense.category,
          date: expense.date,
        });
        fetchExpenses();
        fetchProfile();
      } catch (err) {
        console.error('Failed to update');
      }
    }
  };

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.updateBalance(parseFloat(newBalance));
      fetchProfile();
      setShowBalanceModal(false);
      setNewBalance('');
    } catch (err) {
      console.error('Failed to update balance');
    }
  };

  const handleUpdateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userAPI.updateIncome(parseFloat(newIncome));
      fetchProfile();
      setShowIncomeModal(false);
      setNewIncome('');
    } catch (err) {
      console.error('Failed to update income');
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchProfile();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const filteredExpenses = expenses.filter((exp: any) => {
    const expDate = new Date(exp.date);
    const matchesMonth = expDate.getMonth() === selectedMonth && expDate.getFullYear() === selectedYear;
    const matchesSearch = searchTerm === '' || 
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const totalFilteredExpense = filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Real Chart Data
  const categoryTotals: any = {};
  filteredExpenses.forEach((exp: any) => {
    const cat = exp.category?.split(' ')[1] || exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (exp.amount || 0);
  });

  const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
    const dayData: any = { name: day };
    Object.keys(categoryTotals).forEach(cat => { dayData[cat] = 0; });
    filteredExpenses.forEach((exp: any) => {
      const expDay = new Date(exp.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (expDay === day) {
        const cat = exp.category?.split(' ')[1] || exp.category || 'Other';
        dayData[cat] = (dayData[cat] || 0) + (exp.amount || 0);
      }
    });
    return dayData;
  });

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
  }));

  const CHART_COLORS = ['#FCA311', '#14213D', '#E59200', '#1A2A4A', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'];

  // Notifications
  const notifications: any[] = [];
  Object.keys(categoryTotals).forEach(cat => {
    if (monthlyIncome > 0 && categoryTotals[cat] > monthlyIncome * 0.3) {
      notifications.push({
        icon: '⚠️',
        text: `${cat} spending is high: ₹${categoryTotals[cat].toLocaleString()}`,
        time: 'This month',
      });
    }
  });
  if (filteredExpenses.length === 0) {
    notifications.push({ icon: '📊', text: 'Add your first expense to see insights!', time: 'Now' });
  }
  if (totalFilteredExpense > 0 && monthlyIncome > 0 && totalFilteredExpense > monthlyIncome * 0.8) {
    notifications.push({ icon: '🚨', text: `You've spent ${((totalFilteredExpense/monthlyIncome)*100).toFixed(0)}% of your income!`, time: 'Alert' });
  }

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <p style={{ color: colors.text }}>Loading...</p>
      </div>
    );
  }

  const recentTransactions = filteredExpenses.slice(-4).reverse();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b sticky top-0 z-50" style={{ borderColor: colors.border, backgroundColor: colors.navBg }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <h1 className="text-2xl font-extrabold" style={{ color: '#FCA311' }}>FinVerse</h1>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border text-sm outline-none hidden md:block"
            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg, width: '250px' }}
            onFocus={(e) => (e.target.style.borderColor = '#FCA311')}
            onBlur={(e) => (e.target.style.borderColor = colors.border)}
          />

          <button onClick={toggleTheme} className="text-xl cursor-pointer" style={{ background: 'none', border: 'none' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="relative text-xl cursor-pointer" style={{ background: 'none', border: 'none' }}>
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: '#EF4444' }}>
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 p-4 rounded-xl border shadow-lg z-50 max-h-96 overflow-y-auto" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold" style={{ color: colors.text }}>🔔 Notifications</h4>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: '#FCA311', color: '#FFFFFF' }}>{notifications.length}</span>
                </div>
                {notifications.length > 0 ? notifications.map((notif: any, i: number) => (
                  <div key={i} className="py-2" style={{ borderBottom: i < notifications.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{notif.icon} {notif.text}</p>
                    <p className="text-xs mt-1" style={{ color: '#64748B' }}>{notif.time}</p>
                  </div>
                )) : (
                  <p className="text-sm text-center py-2" style={{ color: colors.textSecondary }}>No notifications</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#14213D' }}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block font-medium" style={{ color: colors.text }}>{user.name}</span>
          </div>

          <Link to="/settings" className="text-sm font-medium hover:underline hidden md:block" style={{ color: colors.textSecondary }}>
            ⚙️ Settings
          </Link>

          <button onClick={handleLogout} className="text-sm font-medium hover:underline cursor-pointer" style={{ color: '#EF4444', background: 'none', border: 'none' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: colors.text }}>📊 Dashboard Overview</h2>
            <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>Welcome back, {user.name}! Here's your financial summary.</p>
          </div>
          <select
            className="px-4 py-2 rounded-xl border text-sm outline-none cursor-pointer"
            style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }}
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split('-');
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month));
            }}
          >
            {monthNames.map((month, i) => (
              <option key={i} value={`${selectedYear}-${i}`}>{month} {selectedYear}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl border hover:shadow-lg transition cursor-pointer" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }} onClick={() => { setNewBalance(balance.toString()); setShowBalanceModal(true); }}>
            <span className="text-3xl">💰</span>
            <p className="text-sm mt-2 font-medium" style={{ color: colors.textSecondary }}>Total Balance (Click to edit)</p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: colors.text }}>₹{balance.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-xl border hover:shadow-lg transition cursor-pointer" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }} onClick={() => { setNewIncome(monthlyIncome.toString()); setShowIncomeModal(true); }}>
            <span className="text-3xl">📈</span>
            <p className="text-sm mt-2 font-medium" style={{ color: colors.textSecondary }}>Monthly Income (Click to edit)</p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: colors.text }}>₹{monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="p-6 rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
            <span className="text-3xl">📉</span>
            <p className="text-sm mt-2 font-medium" style={{ color: colors.textSecondary }}>Expense ({monthNames[selectedMonth].slice(0,3)})</p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: '#EF4444' }}>₹{totalFilteredExpense.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-6 rounded-xl border mb-8" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>📊 Expense Overview</h3>
          
          <div className="flex gap-2 mb-6">
            {['bar', 'line', 'pie'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                style={{
                  backgroundColor: chartType === type ? '#FCA311' : colors.hover,
                  color: chartType === type ? '#FFFFFF' : colors.textSecondary,
                  border: 'none',
                }}
              >
                {type === 'bar' && '📊 Bar'}
                {type === 'line' && '📈 Line'}
                {type === 'pie' && '🥧 Pie'}
              </button>
            ))}
          </div>

          <div className="h-80">
            {filteredExpenses.length === 0 ? (
              <div className="h-full flex items-center justify-center" style={{ color: colors.textSecondary }}>
                <p className="text-lg">Add expenses to see charts 📊</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' && (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="name" stroke={colors.textSecondary} />
                    <YAxis stroke={colors.textSecondary} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(categoryTotals).map((cat, i) => (
                      <Bar key={cat} dataKey={cat} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </BarChart>
                )}
                {chartType === 'line' && (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="name" stroke={colors.textSecondary} />
                    <YAxis stroke={colors.textSecondary} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(categoryTotals).map((cat, i) => (
                      <Line key={cat} type="monotone" dataKey={cat} stroke={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </LineChart>
                )}
                {chartType === 'pie' && pieData.length > 0 && (
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Expense Table */}
        <div className="p-6 rounded-xl border mb-8" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>📋 {monthNames[selectedMonth]} Expenses</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                  {['Date', 'Category', 'Description', 'Amount', 'Action'].map((header, i) => (
                    <th key={i} className="text-left py-3 px-4 font-bold" style={{ color: colors.textSecondary }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((row: any, i: number) => (
                    <tr key={row.id || i} className="transition" style={{ borderBottom: `1px solid ${colors.border}`, backgroundColor: i % 2 === 0 ? colors.cardBg : colors.hover }}>
                      <td className="py-3 px-4" style={{ color: '#64748B' }}>
                        {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3 px-4 font-medium" style={{ color: colors.text }}>{row.category}</td>
                      <td className="py-3 px-4" style={{ color: colors.textSecondary }}>{row.description}</td>
                      <td className="py-3 px-4 font-bold" style={{ color: '#EF4444' }}>
                        -₹{row.amount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleEdit(row.id, row)} className="mr-2 cursor-pointer" style={{ background: 'none', border: 'none' }}>✏️</button>
                        <button onClick={() => handleDelete(row.id)} className="cursor-pointer" style={{ background: 'none', border: 'none' }}>🗑️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8" style={{ color: colors.textSecondary }}>
                      No expenses in {monthNames[selectedMonth]}. Click + to add!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-xl text-center" style={{ backgroundColor: colors.totalBg }}>
            <p className="text-lg font-extrabold" style={{ color: colors.text }}>
              💸 Total Spent in {monthNames[selectedMonth]}: <span style={{ color: '#FCA311' }}>
                ₹{totalFilteredExpense.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-xl border" style={{ borderColor: colors.border, backgroundColor: colors.cardBg }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.text }}>🕐 Recent Transactions</h3>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((txn: any, i: number) => (
              <div key={txn.id || i} className="flex items-center justify-between py-3" style={{ borderBottom: i < recentTransactions.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: colors.hover }}>
                    {txn.category?.split(' ')[0] || '📁'}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.text }}>{txn.description}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{txn.category} • {new Date(txn.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <p className="font-bold text-lg" style={{ color: '#EF4444' }}>
                  -₹{txn.amount?.toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-4" style={{ color: colors.textSecondary }}>No transactions yet in {monthNames[selectedMonth]}</p>
          )}
        </div>
      </main>

      {/* FAB Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white text-2xl font-bold shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center z-50"
        style={{ backgroundColor: '#FCA311', border: 'none' }}
      >
        +
      </button>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg p-8 rounded-2xl mx-4" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold" style={{ color: colors.text }}>✨ Add New Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-xl cursor-pointer" style={{ background: 'none', border: 'none', color: colors.textSecondary }}>✕</button>
            </div>

            <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await expensesAPI.add({
                  amount: parseFloat(newExpense.amount),
                  description: newExpense.description,
                  category: newExpense.category,
                  date: newExpense.date,
                });
                setShowModal(false);
                setNewExpense({ amount: '', description: '', category: '🍕 Food', date: new Date().toISOString().split('T')[0] });
                fetchExpenses();
                fetchProfile();
              } catch (err) {
                console.error('Failed to add expense');
              } finally {
                setLoading(false);
              }
            }}>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>Amount</label>
                <div className="flex items-center rounded-xl border overflow-hidden" style={{ borderColor: colors.border }}>
                  <span className="px-3 py-3 font-bold" style={{ backgroundColor: colors.hover, color: colors.text }}>₹</span>
                  <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="0.00" required className="w-full px-4 py-3 outline-none text-base" style={{ color: colors.text, backgroundColor: colors.inputBg }} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>Category</label>
                <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none text-base cursor-pointer" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }}>
                  {['🍕 Food', '⛽ Petrol', '✈️ Travel', '🛒 Shopping', '💊 Healthcare', '🎬 Entertainment', '📚 Education', '🏠 Rent'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {['🍕 Food', '⛽ Petrol', '✈️ Travel', '🛒 Shopping'].map(cat => (
                  <button key={cat} type="button" onClick={() => setNewExpense({ ...newExpense, category: cat })} className="px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer" style={{ backgroundColor: newExpense.category === cat ? '#FCA311' : colors.hover, color: newExpense.category === cat ? '#FFFFFF' : colors.textSecondary, border: 'none' }}>{cat}</button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>Description</label>
                <input type="text" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} placeholder="Enter description..." required className="w-full px-4 py-3 rounded-xl border outline-none text-base" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>Date</label>
                <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border outline-none text-base cursor-pointer" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }} />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 cursor-pointer" style={{ backgroundColor: '#FCA311' }}>
                {loading ? 'Saving...' : '💾 Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Balance Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm p-6 rounded-2xl mx-4" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <h3 className="text-xl font-extrabold mb-4" style={{ color: colors.text }}>💰 Update Balance</h3>
            <form onSubmit={handleUpdateBalance} className="space-y-4">
              <input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="Enter new balance" required className="w-full px-4 py-3 rounded-xl border outline-none text-base" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }} />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowBalanceModal(false)} className="flex-1 py-2 rounded-xl border font-semibold cursor-pointer" style={{ borderColor: colors.border, color: colors.textSecondary, backgroundColor: colors.hover }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl text-white font-bold cursor-pointer" style={{ backgroundColor: '#FCA311' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Income Modal */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm p-6 rounded-2xl mx-4" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <h3 className="text-xl font-extrabold mb-4" style={{ color: colors.text }}>📈 Update Monthly Income</h3>
            <form onSubmit={handleUpdateIncome} className="space-y-4">
              <input type="number" value={newIncome} onChange={(e) => setNewIncome(e.target.value)} placeholder="Enter monthly income" required className="w-full px-4 py-3 rounded-xl border outline-none text-base" style={{ borderColor: colors.border, color: colors.text, backgroundColor: colors.inputBg }} />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowIncomeModal(false)} className="flex-1 py-2 rounded-xl border font-semibold cursor-pointer" style={{ borderColor: colors.border, color: colors.textSecondary, backgroundColor: colors.hover }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl text-white font-bold cursor-pointer" style={{ backgroundColor: '#FCA311' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;