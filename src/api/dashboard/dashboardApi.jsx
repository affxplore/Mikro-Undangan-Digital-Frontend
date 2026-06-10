import apiService from '../apiService';

export const getAdminDashboardStats = () => {
  return apiService.get('/dashboard/admin-stats');
};

export const getUserDashboardStats = () => {
  return apiService.get('/dashboard/user-stats');
}; 