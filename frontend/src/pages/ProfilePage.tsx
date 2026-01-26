import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Edit2, Check, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, isLoading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to view your profile.</div>;
  }

  const handleEdit = () => {
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      // We call updateProfile which handles optimistic update
      // We don't 'await' it if we want to "not wait for answer" visually, 
      // but we do want to catch errors.
      // Actually, updateProfile in context is async and we should probably wait for it 
      // if we want to close the edit mode only on success, 
      // OR we close it immediately (optimistic UX).
      
      setIsEditing(false); // Close edit mode immediately (Optimistic UX)
      
      updateProfile({ firstname, lastname }).catch(err => {
          setError("Failed to update profile. Please try again.");
          console.error(err);
      });

    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
              My Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
            </button>
          )}
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" /> First Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                ) : (
                  user.firstname
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" /> Last Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                ) : (
                  user.lastname
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-gray-500 italic">
                {user.email} (Email cannot be changed)
              </dd>
            </div>
          </dl>
        </div>
        {isEditing && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="mr-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Check className="h-4 w-4 mr-2" /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;