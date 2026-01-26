import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { University, Review } from '../types';
import { Star, MapPin, Globe, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';



const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [tags, setTags] = useState(''); // Comma separated

  const fetchUniversityData = async () => {
    try {
      setLoading(true);
      const [uniResponse, reviewsResponse] = await Promise.all([
        api.get<University>(`/universities/${id}`),
        api.get<Review[]>(`/reviews/university/${id}`)
      ]);
      setUniversity(uniResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching university data:', error);
      setUniversity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchUniversityData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        universityId: Number(id),
        rating,
        text,
        tags: tags.split(',').map(tag => tag.trim()).filter(t => t !== '')
      });
      setShowReviewForm(false);
      setText('');
      setTags('');
      // Refresh data to show new review
      const reviewsResponse = await api.get<Review[]>(`/reviews/university/${id}`);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
      if (!confirm('Are you sure you want to delete your review?')) return;
      try {
          await api.delete(`/reviews/${reviewId}`);
          setReviews(reviews.filter(r => r.id !== reviewId));
      } catch (error) {
          console.error('Failed to delete review', error);
          alert('Failed to delete review');
      }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!university) return <div className="text-center py-10">University not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          {university.logoUrl && (
              <img 
                src={university.logoUrl} 
                alt={`${university.name} logo`} 
                className="h-16 w-16 rounded-full object-contain bg-white border border-gray-100 mr-4"
              />
          )}
          <div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900">
                {university.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details and student reviews.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {university.city}, {university.country}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Globe className="h-4 w-4 mr-2" /> Website
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {university.website}
                </a>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {university.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        {isAuthenticated ? (
           <button 
             onClick={() => setShowReviewForm(!showReviewForm)}
             className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
           >
             {showReviewForm ? 'Cancel' : 'Write a Review'}
           </button>
        ) : (
            <span className="text-sm text-gray-500">Log in to write a review</span>
        )}
      </div>

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave your review</h3>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <Star className={`h-8 w-8 ${star <= rating ? 'fill-indigo-600 text-indigo-600' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mb-4">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                    id="text"
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                    type="text"
                    id="tags"
                    placeholder="e.g. Great Campus, Good Food"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Submit Review
            </button>
        </form>
      )}

      <div className="space-y-4">
        {!isAuthenticated ? (
            <div className="bg-gray-50 border-l-4 border-indigo-400 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-gray-700">
                            Please <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">log in</Link> to view reviews.
                        </p>
                    </div>
                </div>
            </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white shadow rounded-lg p-6 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="flex text-indigo-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 font-medium">{review.rating}/5</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-800 mb-4">{review.text}</p>
              <div className="flex flex-wrap gap-2">
                {review.tags && review.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    #{tag}
                  </span>
                ))}
              </div>
               <div className="mt-2 text-xs text-gray-400">
                  By: {review.userName || 'Anonymous'}
               </div>
               
               {user && review.userId === user.id && (
                   <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition"
                    title="Delete your review"
                   >
                       <Trash2 className="h-5 w-5" />
                   </button>
               )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default UniversityPage;
