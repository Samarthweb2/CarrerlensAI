import apiClient from './api';

const jobService = {
  getJobs: async () => {
    const response = await apiClient.get('/jobs');
    return response.data;
  }
};

export default jobService;
