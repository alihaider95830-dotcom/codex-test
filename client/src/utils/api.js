import axios from 'axios';

// TESTING MODE: Use mock data instead of API
const TESTING_MODE = true;

const api = axios.create({
  baseURL: '/api',
});

// Mock data storage
const mockStorage = {
  getNotes: () => JSON.parse(localStorage.getItem('mockNotes') || '[]'),
  setNotes: (notes) => localStorage.setItem('mockNotes', JSON.stringify(notes)),
  getTags: () => JSON.parse(localStorage.getItem('mockTags') || '[]'),
  setTags: (tags) => localStorage.setItem('mockTags', JSON.stringify(tags)),
};

// Initialize with sample data if empty
if (TESTING_MODE && mockStorage.getNotes().length === 0) {
  mockStorage.setNotes([
    {
      id: '1',
      title: 'Welcome to Notes Share! 🎉',
      content: '<p>This is a sample note to get you started.</p><p><strong>Features you can try:</strong></p><ul><li>Create new notes with the "+ New Note" button</li><li>Edit this note by clicking on it</li><li>Add tags to organize your notes</li><li>Use rich text formatting</li><li>Star important notes</li></ul><p>Since we\'re in testing mode, all data is stored locally in your browser.</p>',
      isPrivate: false,
      color: '#6366f1',
      starred: true,
      userId: 'test-user-1',
      Tags: [{ id: '1', name: 'welcome', color: '#6366f1' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  mockStorage.setTags([{ id: '1', name: 'welcome', color: '#6366f1' }]);
}

// Mock API functions
const mockAPI = {
  getNotes: () => Promise.resolve({ data: mockStorage.getNotes() }),
  getNote: (id) => {
    const notes = mockStorage.getNotes();
    const note = notes.find(n => n.id === id);
    return Promise.resolve({ data: note });
  },
  createNote: (data) => {
    const notes = mockStorage.getNotes();
    const newNote = {
      ...data,
      id: Date.now().toString(),
      userId: 'test-user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Tags: [],
    };
    notes.push(newNote);
    mockStorage.setNotes(notes);
    return Promise.resolve({ data: newNote });
  },
  updateNote: (id, data) => {
    const notes = mockStorage.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...data, updatedAt: new Date().toISOString() };
      mockStorage.setNotes(notes);
      return Promise.resolve({ data: notes[index] });
    }
    return Promise.reject(new Error('Note not found'));
  },
  deleteNote: (id) => {
    const notes = mockStorage.getNotes().filter(n => n.id !== id);
    mockStorage.setNotes(notes);
    return Promise.resolve({ data: { message: 'Deleted' } });
  },
  getSharedNotes: () => Promise.resolve({ data: [] }),
  getTags: () => Promise.resolve({ data: mockStorage.getTags() }),
  shareNote: () => Promise.resolve({ data: {} }),
  updateShare: () => Promise.resolve({ data: {} }),
  deleteShare: () => Promise.resolve({ data: {} }),
  getNoteComments: () => Promise.resolve({ data: [] }),
  addComment: () => Promise.resolve({ data: {} }),
  deleteComment: () => Promise.resolve({ data: {} }),
  getNotifications: () => Promise.resolve({ data: [] }),
  markNotificationRead: () => Promise.resolve({ data: {} }),
  markAllNotificationsRead: () => Promise.resolve({ data: {} }),
  getUsers: () => Promise.resolve({ data: [] }),
  updateProfile: (data) => Promise.resolve({ data }),
};

// Export functions - use mock or real API based on TESTING_MODE
export const getNotes = TESTING_MODE ? mockAPI.getNotes : (params) => api.get('/notes', { params });
export const getNote = TESTING_MODE ? mockAPI.getNote : (id) => api.get(`/notes/${id}`);
export const createNote = TESTING_MODE ? mockAPI.createNote : (data) => api.post('/notes', data);
export const updateNote = TESTING_MODE ? mockAPI.updateNote : (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = TESTING_MODE ? mockAPI.deleteNote : (id) => api.delete(`/notes/${id}`);
export const getSharedNotes = TESTING_MODE ? mockAPI.getSharedNotes : () => api.get('/notes/shared');

export const getTags = TESTING_MODE ? mockAPI.getTags : () => api.get('/tags');

export const shareNote = TESTING_MODE ? mockAPI.shareNote : (data) => api.post('/shares', data);
export const updateShare = TESTING_MODE ? mockAPI.updateShare : (id, data) => api.put(`/shares/${id}`, data);
export const deleteShare = TESTING_MODE ? mockAPI.deleteShare : (id) => api.delete(`/shares/${id}`);

export const getNoteComments = TESTING_MODE ? mockAPI.getNoteComments : (noteId) => api.get(`/comments/note/${noteId}`);
export const addComment = TESTING_MODE ? mockAPI.addComment : (data) => api.post('/comments', data);
export const deleteComment = TESTING_MODE ? mockAPI.deleteComment : (id) => api.delete(`/comments/${id}`);

export const getNotifications = TESTING_MODE ? mockAPI.getNotifications : () => api.get('/notifications');
export const markNotificationRead = TESTING_MODE ? mockAPI.markNotificationRead : (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = TESTING_MODE ? mockAPI.markAllNotificationsRead : () => api.put('/notifications/read-all');

export const getUsers = TESTING_MODE ? mockAPI.getUsers : () => api.get('/auth/users');
export const updateProfile = TESTING_MODE ? mockAPI.updateProfile : (data) => api.put('/auth/profile', data);

export default api;
