import apiClient from './api';

const dashboardService = {
  getDashboardData: async (analysisId, shareToken) => {
    const url = shareToken ? `/dashboard/${analysisId}?token=${shareToken}` : `/dashboard/${analysisId}`;
    const response = await apiClient.get(url);
    return response.data;
  },
  generateShareToken: async (analysisId) => {
    const response = await apiClient.post(`/dashboard/${analysisId}/share`);
    return response.data;
  }
};

export default dashboardService;
