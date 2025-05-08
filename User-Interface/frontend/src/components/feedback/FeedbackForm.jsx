import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';

const FeedbackForm = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Feedback categories
  const categories = [
    { value: 'ui', label: 'User Interface' },
    { value: 'functionality', label: 'Functionality' },
    { value: 'accuracy', label: 'Response Accuracy' },
    { value: 'speed', label: 'Response Speed' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      addToast("Please provide a rating before submitting", "error");
      return;
    }
    
    if (!category) {
      addToast("Please select a feedback category", "error");
      return;
    }
    
    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Save feedback to Firestore
      await addDoc(collection(db, "feedback"), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        rating,
        category,
        comment,
        createdAt: serverTimestamp()
      });
      
      setSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment('');
        setCategory('');
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      addToast("Failed to submit feedback. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-xl max-w-lg w-full shadow-2xl border border-[#2a2a2a] overflow-hidden">
        {submitted ? (
          // Success message
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#f75600]/20 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#f75600]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#f75600] mb-2">Thank You for Your Feedback!</h3>
            <p className="text-[#d6d4d4] mb-6">Your feedback helps us improve Medibot for everyone.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#f75600] hover:bg-[#E2711D] text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          // Feedback form
          <>
            <div className="bg-gradient-to-r from-[#f75600] to-[#E2711D] px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white text-left">Share Your Feedback</h2>
                <button 
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-[#d6d4d4] mb-2 text-left">
                  How would you rate your experience?*
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none focus:ring-0"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-8 w-8 ${
                          (hoverRating || rating) >= star 
                            ? 'text-[#f75600]' 
                            : 'text-gray-400'
                        } transition-colors`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>
              
              {/* Feedback Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[#d6d4d4] mb-2 text-left">
                  Feedback Category*
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm text-[#d6d4d4] focus:ring-[#f75600] focus:border-[#f75600] appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Comments */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-[#d6d4d4] mb-2 text-left">
                  Additional Comments
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  className="block w-full p-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm text-[#d6d4d4] placeholder-gray-500 focus:ring-[#f75600] focus:border-[#f75600]"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-[#2a2a2a] bg-[#121212] text-[#d6d4d4] rounded-md shadow-sm mr-3 hover:bg-[#232323]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-[#f75600] to-[#E2711D] text-white rounded-md shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;