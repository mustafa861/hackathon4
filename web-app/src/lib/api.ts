import axios from 'axios';
import BACKEND_URL from './constants';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getChapters = async () => {
  const response = await api.get('/chapters/');
  return response.data;
};

export const getChapter = async (chapterId: string) => {
  const response = await api.get(`/chapters/${chapterId}`);
  return response.data;
};

export const getChapterNavigation = async (chapterId: string) => {
  const response = await api.get(`/chapters/${chapterId}/navigation`);
  return response.data;
};

export const getQuizzes = async () => {
  const response = await api.get('/quizzes/');
  return response.data;
};

export const getQuiz = async (quizId: string) => {
  const response = await api.get(`/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: Record<string, number>) => {
  const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
};

export const getProgress = async (userId: string) => {
  const response = await api.get(`/progress/${userId}`);
  return response.data;
};

export const updateProgress = async (userId: string, data: { chapter_id: string; completed?: boolean; time_spent?: number; score?: number }) => {
  const response = await api.put(`/progress/${userId}`, data);
  return response.data;
};

export const checkAccess = async (userId: string, chapterId: string) => {
  const response = await api.post('/access/check', { user_id: userId, chapter_id: chapterId });
  return response.data;
};

export const searchContent = async (query: string) => {
  const response = await api.get(`/search/?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getHybridFeature = async (userId: string, feature: string, data: Record<string, any>) => {
  const response = await api.post('/hybrid/feature', { user_id: userId, feature, data });
  return response.data;
};

export default api;
