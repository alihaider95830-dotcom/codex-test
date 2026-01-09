import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Star, Filter, FileText, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { getNotes, updateNote, deleteNote, getSharedNotes, getTags } from '../utils/api';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterStarred, setFilterStarred] = useState(false);
  const [activeTab, setActiveTab] = useState('my-notes');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [searchQuery, filterTag, filterStarred]);

  const fetchData = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterTag) params.tag = filterTag;
      if (filterStarred) params.starred = 'true';

      const [notesRes, sharedRes, tagsRes] = await Promise.all([
        getNotes(params),
        getSharedNotes(),
        getTags(),
      ]);

      setNotes(notesRes.data);
      setSharedNotes(sharedRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/new');
  };

  const handleStarNote = async (note) => {
    try {
      await updateNote(note.id, { starred: !note.starred });
      fetchData();
    } catch (error) {
      console.error('Failed to star note:', error);
    }
  };

  const displayNotes = activeTab === 'my-notes' ? notes : sharedNotes.map(s => s.Note);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and share your thoughts
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="input"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterStarred(!filterStarred)}
              className={`btn ${
                filterStarred ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <Star className="w-4 h-4" />
            </button>

            <button onClick={handleCreateNote} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('my-notes')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'my-notes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              My Notes ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                activeTab === 'shared'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Shared with Me ({sharedNotes.length})
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <Loading />
        ) : displayNotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No notes yet"
            description={
              activeTab === 'my-notes'
                ? 'Create your first note to get started'
                : 'No notes have been shared with you yet'
            }
            action={
              activeTab === 'my-notes' && (
                <button onClick={handleCreateNote} className="btn btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onStar={handleStarNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
