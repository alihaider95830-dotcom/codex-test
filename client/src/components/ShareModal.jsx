import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Avatar from './Avatar';
import { getUsers, shareNote } from '../utils/api';
import { UserPlus } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, noteId, onShare }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedUser) return;

    try {
      await shareNote({
        noteId,
        receiverId: selectedUser.id,
        canEdit,
      });
      onShare();
      onClose();
    } catch (error) {
      console.error('Failed to share note:', error);
      alert('Failed to share note');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Note" size="md">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Share this note with your friends
        </p>

        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'bg-primary-100 dark:bg-primary-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Avatar user={user} size="md" />
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedUser && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canEdit}
                    onChange={(e) => setCanEdit(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm">Allow editing</span>
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={!selectedUser}
                className="btn btn-primary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ShareModal;
