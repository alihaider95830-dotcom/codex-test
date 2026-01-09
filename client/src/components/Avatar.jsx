import React from 'react';
import { getInitials, getAvatarColor } from '../utils/helpers';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const sizeClass = sizes[size] || sizes.md;

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username}
        className={`${sizeClass} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(
        user?.username
      )} ${className}`}
    >
      {getInitials(user?.username)}
    </div>
  );
};

export default Avatar;
