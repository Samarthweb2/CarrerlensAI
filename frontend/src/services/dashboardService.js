import apiClient from './api';

const dashboardService = {
  getDashboardData: async (analysisId) => {
    const response = await apiClient.get(`/dashboard/${analysisId}`);
    return response.data;
  }
};

export default dashboardService;
