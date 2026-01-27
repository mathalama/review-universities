import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { University, Review } from '../types';
import { Star, MapPin, Globe, Calendar, Trash2, Wifi, Coffee, BookOpen, Briefcase, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UniversityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [facilities, setFacilities] = useState(5);
  const [opportunities, setOpportunities] = useState(5);
  const [locationScore, setLocationScore] = useState(5);
  const [internet, setInternet] = useState(5);
  const [food, setFood] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [status, setStatus] = useState('Current Student');
  
  const [text, setText] = useState('');
  const [tags, setTags] = useState(''); 
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        universityId: Number(id),
        rating,
        facilities,
        opportunities,
        location: locationScore,
        internet,
        food,
        difficulty,
        status,
        text,
        tags: tags.split(',').map(tag => tag.trim()).filter(t => t !== '')
      });
      setShowReviewForm(false);
      setText('');
      setTags('');
      // Reset defaults
      setRating(5);
      setFacilities(5);
      setOpportunities(5);
      setLocationScore(5);
      setInternet(5);
      setFood(5);
      setDifficulty(3);
      setStatus('Current Student');

      // Refresh data
      const reviewsResponse = await api.get<Review[]>(`/reviews/university/${id}`);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Failed to submit review', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
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

  const renderStars = (score: number, setScore?: (n: number) => void, size: string = "h-5 w-5") => {
      return (
          <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                      key={star}
                      type="button"
                      onClick={() => setScore && setScore(star)}
                      className={`focus:outline-none ${!setScore ? 'cursor-default' : ''}`}
                      disabled={!setScore}
                  >
                      <Star className={`${size} ${star <= score ? 'fill-indigo-600 text-indigo-600' : 'text-gray-300'}`} />
                  </button>
              ))}
          </div>
      );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!university) return <div className="text-center py-10">University not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* University Header Card */}
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
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Detailed Review</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
                    {renderStars(rating, setRating, "h-8 w-8")}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option>Current Student</option>
                        <option>Alumnus</option>
                        <option>Prospective Student</option>
                    </select>
                </div>
                
                {/* Specific Ratings */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Building className="h-4 w-4 mr-1"/> Facilities</label>
                    {renderStars(facilities, setFacilities)}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Briefcase className="h-4 w-4 mr-1"/> Opportunities</label>
                    {renderStars(opportunities, setOpportunities)}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><MapPin className="h-4 w-4 mr-1"/> Location</label>
                    {renderStars(locationScore, setLocationScore)}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Wifi className="h-4 w-4 mr-1"/> Internet</label>
                    {renderStars(internet, setInternet)}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Coffee className="h-4 w-4 mr-1"/> Food</label>
                    {renderStars(food, setFood)}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><BookOpen className="h-4 w-4 mr-1"/> Difficulty (1=Easy, 5=Hard)</label>
                    {renderStars(difficulty, setDifficulty)}
                </div>
            </div>
            
            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                <textarea
                    id="text"
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                />
            </div>

            <div>
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
                disabled={isSubmittingReview}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmittingReview ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white shadow rounded-lg p-6 relative">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div>
                      <div className="flex items-center mb-1">
                          {renderStars(review.rating, undefined)}
                          <span className="ml-2 font-bold text-gray-900">{review.rating}/5</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                           <span className="font-medium text-indigo-600">{review.status || 'Student'}</span>
                           <span>•</span>
                           <span className="flex items-center"><Calendar className="h-3 w-3 mr-1"/> {new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                  </div>
                  {/* Detailed Ratings Grid for Viewer */}
                  <div className="mt-2 sm:mt-0 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {review.facilities > 0 && <div className="flex items-center justify-between gap-2"><span>Facilities:</span> <span className="font-medium">{review.facilities}/5</span></div>}
                      {review.opportunities > 0 && <div className="flex items-center justify-between gap-2"><span>Opportunities:</span> <span className="font-medium">{review.opportunities}/5</span></div>}
                      {review.location > 0 && <div className="flex items-center justify-between gap-2"><span>Location:</span> <span className="font-medium">{review.location}/5</span></div>}
                      {review.internet > 0 && <div className="flex items-center justify-between gap-2"><span>Internet:</span> <span className="font-medium">{review.internet}/5</span></div>}
                      {review.food > 0 && <div className="flex items-center justify-between gap-2"><span>Food:</span> <span className="font-medium">{review.food}/5</span></div>}
                      {review.difficulty > 0 && <div className="flex items-center justify-between gap-2"><span>Difficulty:</span> <span className="font-medium">{review.difficulty}/5</span></div>}
                  </div>
              </div>
              
              <p className="text-gray-800 mb-4 whitespace-pre-line">{review.text}</p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {review.tags && review.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    #{tag}
                  </span>
                ))}
              </div>
               <div className="text-xs text-gray-400">
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
