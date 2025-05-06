
import React from 'react';

const EmptyUserState: React.FC = () => {
  return (
    <div className="border rounded-lg p-8 text-center">
      <p className="text-gray-500 mb-1">No users found</p>
      <p className="text-gray-400 text-sm">
        Create a new user by clicking the "Add New User" button or sync your account
      </p>
    </div>
  );
};

export default EmptyUserState;
