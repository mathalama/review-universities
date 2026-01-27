import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { University } from '../types';

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

const AddUniversityPage: React.FC = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState(''); // Optional, backend supports it
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post<University>('/universities', {
        name,
        country,
        city,
        description,
        website,
        logoUrl
      });
      navigate(`/university/${response.data.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to create university. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add University</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow sm:rounded-lg p-6">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">University Name</label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select
            id="country"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website URL</label>
          <input
            type="url"
            id="website"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        
         <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL (Optional)</label>
          <input
            type="url"
            id="logoUrl"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading ? 'Creating...' : 'Create University'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUniversityPage;
