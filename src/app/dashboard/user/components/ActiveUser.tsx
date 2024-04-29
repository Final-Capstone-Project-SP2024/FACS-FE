import React from 'react';
import { toast } from 'react-toastify';

export default function ActiveUser({ userId, token, onUserUpdated }: { userId: string, token: string | undefined, onUserUpdated: () => void }) {
  
  const handleActiveUser = async () => {
    try {
      const response = await fetch(`https://firealarmcamerasolution.azurewebsites.net/api/v1/User/${userId}/active`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('User set to active successfully');
        onUserUpdated();
      } else {
        const errorData = await response.json();
        toast.error(errorData.Message || 'Failed to set user to active');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <>
      <button
        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
        onClick={handleActiveUser}
      >
        Active
      </button>
    </>
  );
}