import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { University } from '../types';
import { Search, MapPin, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await api.get<University[]>('/universities');
        if (Array.isArray(response.data)) {
            setUniversities(response.data);
        } else {
            console.error('API Error: Expected array of universities, got:', response.data);
            setUniversities([]);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const safeUniversities = Array.isArray(universities) ? universities : [];

  const filteredUniversities = safeUniversities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (uni.tags && uni.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Find your dream University
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Real reviews from real students. Discover the truth about education, dorms, and student life.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
            placeholder="Search by name, city, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUniversities.map((uni) => (
            <Link key={uni.id} to={`/university/${uni.id}`} className="block group">
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                     {uni.logoUrl ? (
                         <img 
                             src={uni.logoUrl} 
                             alt={`${uni.name} logo`} 
                             className="h-12 w-12 rounded-full object-contain bg-white border border-gray-100"
                         />
                     ) : (
                         <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {uni.name.substring(0, 2).toUpperCase()}
                         </div>
                     )}
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       {uni.averageRating ? uni.averageRating : '0.0'} <Star className="h-3 w-3 ml-1 fill-current" />
                     </span>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 group-hover:text-indigo-600">
                    {uni.name}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {uni.city}, {uni.country}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {uni.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
