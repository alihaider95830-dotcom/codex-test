import React, { useState, useEffect } from 'react';
import { getNoteComments, addComment, deleteComment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import { formatRelativeTime } from '../utils/helpers';
import { Send, Trash2 } from 'lucide-react';

const CommentSection = ({ noteId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [noteId]);

  const fetchComments = async () => {
    try {
      const response = await getNoteComments(noteId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        noteId,
        content: newComment,
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      <form onSubmit={handleAddComment} className="flex gap-3">
        <Avatar user={user} size="sm" />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="input flex-1"
          />
          <button type="submit" className="btn btn-primary">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Avatar user={comment.User} size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{comment.User.username}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  {comment.userId === user.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
