import apiClient from './api';

const resumeService = {
  uploadResume: async (file, jobDescription, onUploadProgress) => {
    let actualJobDescription = jobDescription;
    let actualOnUploadProgress = onUploadProgress;
    if (typeof jobDescription === 'function') {
      actualOnUploadProgress = jobDescription;
      actualJobDescription = null;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (actualJobDescription) {
      formData.append('job_description', actualJobDescription);
    }

    const response = await apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (actualOnUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          actualOnUploadProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },

  getResume: async (id) => {
    const response = await apiClient.get(`/resume/${id}`);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await apiClient.delete(`/resume/${id}`);
    return response.data;
  }
};

export default resumeService;
