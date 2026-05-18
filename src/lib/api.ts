export const fetchApi = async (endpoint: string, options: any = {}) => {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

export const api = {
  login: (email: string, password?: string) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (user: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(user) }),
  getUsers: () => fetchApi('/users'),
  getGoals: (userId: string) => fetchApi(`/goals/${userId}`),
  createGoal: (goal: any) => fetchApi('/goals', { method: 'POST', body: JSON.stringify(goal) }),
  updateGoal: (id: string, goal: any) => fetchApi(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(goal) }),
  submitGoals: (userId: string) => fetchApi('/goals/submit', { method: 'POST', body: JSON.stringify({ userId }) }),
  approveGoal: (goalId: string, managerId: string) => fetchApi('/goals/approve', { method: 'POST', body: JSON.stringify({ goalId, managerId }) }),
  returnGoal: (goalId: string, managerId: string, comment: string) => fetchApi('/goals/return', { method: 'POST', body: JSON.stringify({ goalId, managerId, comment }) }),
  getNotifications: (userId: string) => fetchApi(`/notifications/${userId}`),
  getAnalytics: (userId: string) => fetchApi(`/analytics/summary/${userId}`),
  aiSuggest: (prompt: string, context: any) => fetchApi('/ai/suggest', { method: 'POST', body: JSON.stringify({ prompt, context }) }),
  getLogs: () => fetchApi('/logs'),
  unlockGoals: (userId: string, adminId: string) => fetchApi('/admin/unlock', { method: 'POST', body: JSON.stringify({ userId, adminId }) }),
  getTeam: (managerId: string) => fetchApi(`/manager/team/${managerId}`),
};
