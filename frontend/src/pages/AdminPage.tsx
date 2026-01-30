import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { User, University, Review } from '../types';
import { Trash2, Edit2, X, Save } from 'lucide-react';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", 
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", 
  "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia", 
  "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", 
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", 
  "Jamaica", "Japan", "Jordan", 
  "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", 
  "Latvia", "Lebanon", "Lithuania", "Luxembourg", 
  "Malaysia", "Malta", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", 
  "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Macedonia", "Norway", 
  "Oman", 
  "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", 
  "Qatar", 
  "Romania", "Russia", 
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", 
  "Taiwan", "Tajikistan", "Thailand", "Tunisia", "Turkey", 
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", 
  "Venezuela", "Vietnam"
];

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'universities' | 'reviews'>('users');
  const [loading, setLoading] = useState(false);
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [currentUni, setCurrentUni] = useState<University | null>(null);
  const [editForm, setEditForm] = useState({
      name: '',
      country: '',
      city: '',
      description: '',
      website: '',
      logoUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await api.get<User[]>('/users');
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else if (activeTab === 'universities') {
        const response = await api.get<University[]>('/universities');
        setUniversities(Array.isArray(response.data) ? response.data : []);
      } else if (activeTab === 'reviews') {
        const response = await api.get<Review[]>('/reviews');
        setReviews(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Reset state on error to avoid stale non-array data
      if (activeTab === 'users') setUsers([]);
      if (activeTab === 'universities') setUniversities([]);
      if (activeTab === 'reviews') setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user', error);
      alert('Failed to delete user');
    }
  };

  const deleteUniversity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      await api.delete(`/universities/${id}`);
      setUniversities(universities.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete university', error);
      alert('Failed to delete university');
    }
  };

  const deleteReview = async (id: number) => {
      if (!confirm('Are you sure you want to delete this review?')) return;
      try {
          await api.delete(`/reviews/${id}`);
          setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
          console.error('Failed to delete review', error);
          alert('Failed to delete review');
      }
  };

  const startEdit = (uni: University) => {
      setCurrentUni(uni);
      setEditForm({
          name: uni.name,
          country: uni.country || COUNTRIES[0],
          city: uni.city,
          description: uni.description,
          website: uni.website,
          logoUrl: uni.logoUrl || ''
      });
      setIsEditing(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUni) return;

      try {
          const response = await api.put<University>(`/universities/${currentUni.id}`, editForm);
          // Update the list
          setUniversities(universities.map(u => u.id === currentUni.id ? response.data : u));
          setIsEditing(false);
          setCurrentUni(null);
      } catch (error) {
          console.error('Failed to update university', error);
          alert('Failed to update university');
      }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="text-center py-10 text-red-600">Access Denied. Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('universities')}
            className={`${
              activeTab === 'universities'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Universities
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`${
              activeTab === 'reviews'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Reviews
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {activeTab === 'users' && users.map((u) => (
              <li key={u.id} className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">{u.firstname} {u.lastname}</p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                    <p className="text-xs text-gray-400">Role: {u.role}</p>
                </div>
                <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}

            {activeTab === 'universities' && universities.map((u) => (
              <li key={u.id} className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50">
                <div className="flex items-center">
                    {u.logoUrl && <img src={u.logoUrl} alt="" className="h-10 w-10 rounded-full mr-3 object-contain border" />}
                    <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">{u.name}</p>
                        <p className="text-sm text-gray-500">{u.city}, {u.country}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                     <button
                        onClick={() => startEdit(u)}
                        className="text-indigo-600 hover:text-indigo-900 p-2"
                        title="Edit"
                    >
                        <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => deleteUniversity(u.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                        title="Delete"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
              </li>
            ))}

            {activeTab === 'reviews' && reviews.map((r) => (
                <li key={r.id} className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                                {r.userName || 'Anonymous'}
                                <span className="text-gray-500 font-normal mx-1">on</span>
                                <a href={`/university/${r.universityId}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-indigo-700">
                                   {r.universityName || 'Unknown University'}
                                </a>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {r.rating} / 5
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                             {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown Date'}
                        </p>
                    </div>
                    <button
                        onClick={() => deleteReview(r.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                        title="Delete Review"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </li>
            ))}
          </ul>
           {((activeTab === 'users' && users.length === 0) || 
             (activeTab === 'universities' && universities.length === 0) ||
             (activeTab === 'reviews' && reviews.length === 0)) && (
               <div className="p-4 text-center text-gray-500">No items found.</div>
           )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Edit University</h2>
                      <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                          <X className="h-6 w-6" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                              type="text"
                              value={editForm.name}
                              onChange={e => setEditForm({...editForm, name: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                          />
                      </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <select
                              value={editForm.country}
                              onChange={e => setEditForm({...editForm, country: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                             {COUNTRIES.map(c => (
                               <option key={c} value={c}>{c}</option>
                             ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                              type="text"
                              value={editForm.city}
                              onChange={e => setEditForm({...editForm, city: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                              rows={3}
                              value={editForm.description}
                              onChange={e => setEditForm({...editForm, description: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          <input
                              type="url"
                              value={editForm.website}
                              onChange={e => setEditForm({...editForm, website: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                          <input
                              type="url"
                              value={editForm.logoUrl}
                              onChange={e => setEditForm({...editForm, logoUrl: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                      </div>

                      <div className="flex justify-end pt-4">
                          <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none mr-3"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                              <Save className="h-4 w-4 mr-2" /> Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminPage;
