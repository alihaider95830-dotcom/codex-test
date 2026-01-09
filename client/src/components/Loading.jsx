import React from 'react';

const Loading = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const sizeClass = sizes[size] || sizes.md;

  const spinner = (
    <div
      className={`${sizeClass} border-primary-600 border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loading;
