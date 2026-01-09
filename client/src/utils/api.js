import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Notes
export const getNotes = (params) => api.get('/notes', { params });
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getSharedNotes = () => api.get('/notes/shared');

// Tags
export const getTags = () => api.get('/tags');

// Shares
export const shareNote = (data) => api.post('/shares', data);
export const updateShare = (id, data) => api.put(`/shares/${id}`, data);
export const deleteShare = (id) => api.delete(`/shares/${id}`);

// Comments
export const getNoteComments = (noteId) => api.get(`/comments/note/${noteId}`);
export const addComment = (data) => api.post('/comments', data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');

// Users
export const getUsers = () => api.get('/auth/users');
export const updateProfile = (data) => api.put('/auth/profile', data);

export default api;
