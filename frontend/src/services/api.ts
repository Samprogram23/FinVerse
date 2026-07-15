const API_URL = 'http://localhost:5000/api';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

export const expensesAPI = {
  getAll: () => apiCall('/expenses'),

  add: (expense: { amount: number; description: string; category: string; date: string }) =>
    apiCall('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  update: (id: string, expense: { amount: number; description: string; category: string; date: string }) =>
    apiCall(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    }),

  delete: (id: string) =>
    apiCall(`/expenses/${id}`, {
      method: 'DELETE',
    }),
};

export const userAPI = {
  getProfile: () => apiCall('/users/profile'),
  updateBalance: (balance: number) =>
    apiCall('/users/balance', {
      method: 'PUT',
      body: JSON.stringify({ balance }),
    }),
  updateIncome: (monthlyIncome: number) =>
    apiCall('/users/income', {
      method: 'PUT',
      body: JSON.stringify({ monthlyIncome }),
    }),
};

export default apiCall;