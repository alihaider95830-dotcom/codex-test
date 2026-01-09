import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Download,
  Star,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import NoteEditor from '../components/NoteEditor';
import ShareModal from '../components/ShareModal';
import CommentSection from '../components/CommentSection';
import TagBadge from '../components/TagBadge';
import Loading from '../components/Loading';
import {
  getNote,
  updateNote,
  deleteNote,
  createNote,
} from '../utils/api';
import { formatDate } from '../utils/helpers';
import jsPDF from 'jspdf';

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(id === 'new');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id !== 'new') {
      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await getNote(id);
      setNote(response.data);
    } catch (error) {
      console.error('Failed to fetch note:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (id === 'new') {
        const response = await createNote(data);
        navigate(`/notes/${response.data.id}`);
      } else {
        await updateNote(id, data);
        await fetchNote();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note');
    }
  };

  const handleStar = async () => {
    try {
      await updateNote(id, { starred: !note.starred });
      fetchNote();
    } catch (error) {
      console.error('Failed to star note:', error);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(note.title, 20, 20);
    doc.setFontSize(12);
    const content = note.content.replace(/<[^>]*>/g, '');
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, 40);
    doc.save(`${note.title}.pdf`);
  };

  const handleExportText = () => {
    const content = note.content.replace(/<[^>]*>/g, '');
    const blob = new Blob([`${note.title}\n\n${content}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <div className="card p-8">
            <NoteEditor
              note={note}
              onSave={handleSave}
              onCancel={() => {
                if (id === 'new') {
                  navigate('/dashboard');
                } else {
                  setIsEditing(false);
                }
              }}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStar}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    note?.starred ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star
                    className="w-5 h-5"
                    fill={note?.starred ? 'currentColor' : 'none'}
                  />
                </button>

                {note?.canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                )}

                <button
                  onClick={() => setShowShareModal(true)}
                  className="btn btn-primary"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>

                <div className="relative group">
                  <button className="btn btn-outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                  <div className="absolute right-0 mt-2 w-48 card hidden group-hover:block">
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={handleExportText}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as Text
                    </button>
                  </div>
                </div>

                {note?.canEdit && (
                  <button
                    onClick={handleDelete}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Note Content */}
            <div className="card p-8 mb-6">
              <h1 className="text-3xl font-bold mb-4">{note?.title}</h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span>{formatDate(note?.createdAt)}</span>
                {note?.User && <span>by {note.User.username}</span>}
              </div>

              {note?.Tags && note.Tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {note.Tags.map(tag => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              )}

              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: note?.content }}
              />
            </div>

            {/* Comments */}
            <div className="card p-8">
              <CommentSection noteId={id} />
            </div>
          </>
        )}
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        noteId={id}
        onShare={fetchNote}
      />
    </div>
  );
};

export default NoteView;
