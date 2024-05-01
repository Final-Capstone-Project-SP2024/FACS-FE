import React from 'react';
import { toast } from 'react-toastify';

export default function InactiveUser({ userId, token, onUserUpdated }: { userId: string, token: string | undefined, onUserUpdated: () => void }) {
  
  const handleInactiveUser = async () => {
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User/${userId}/inactive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('User set to inactive successfully');
        onUserUpdated();
      } else {
        const errorData = await response.json();
        toast.error(errorData.Message || 'Failed to set user to inactive');
      }
    } catch (error) {
      console.error('Error inactivating user:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <>
      <button
        className="bg-red-500 text-white font-bold py-2 px-4 rounded"
        onClick={handleInactiveUser}
      >
        Inactive
      </button>
    </>
  );
}