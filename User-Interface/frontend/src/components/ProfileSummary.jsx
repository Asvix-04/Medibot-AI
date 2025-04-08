import React, { useState, useRef } from 'react';
import defaultAvatar from '../assets/default-avatar.jpeg';

// Profile Photo Upload Component
const ProfilePhotoSection = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex flex-col items-center mb-6">
      <div 
        onClick={handleImageClick} 
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer group"
      >
        <img 
          src={profileImage || defaultAvatar} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-white text-xs font-medium">Change Photo</span>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />
      <button
        onClick={handleImageClick}
        className="mt-3 text-xs font-medium text-black hover:text-gray-700"
      >
        Upload Photo
      </button>
    </div>
  );
};

// Personal Info (Full Name & Age) Component
const PersonalInfoSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Full Name Input */}
      <div>
        <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative rounded-md">
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="bx bxs-user text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>

      {/* Age Input */}
      <div>
        <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">
          Age
        </label>
        <div className="relative rounded-md">
          <input
            type="number"
            name="age"
            id="age"
            min="0"
            max="120"
            required
            value={formData.age}
            onChange={handleChange}
            placeholder="25"
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="bx bx-calendar text-gray-400 text-sm"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSummary = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-black py-5 px-4 relative">
          <h1 className="text-center text-2xl font-bold text-white">Profile Summary</h1>
          <p className="mt-1 text-center text-xs text-gray-400 max-w-sm mx-auto">
            Complete your health profile for personalized care
          </p>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        {/* Form Section */}
        <div className="p-6 bg-white">
          {/* Your components */}
          <ProfilePhotoSection />
          <PersonalInfoSection />
          
          {/* Placeholder for Prasad's dropdown menus */}
          <div className="mt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Medical Information</h3>
            {/* Blood Group dropdown will go here */}
            <div className="mb-4">
              {/* Prasad will add Blood Group dropdown here */}
            </div>
            
            {/* Past Diseases dropdown will go here */}
            <div className="mb-4">
              {/* Prasad will add Past Diseases dropdown here */}
            </div>
            
            {/* Family History dropdown will go here */}
            <div className="mb-4">
              {/* Prasad will add Family History dropdown here */}
            </div>
          </div>
          
          {/* Placeholder for Bakkiyalakshmi's input fields */}
          <div className="mt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Health Information</h3>
            {/* Current Medications input will go here */}
            <div className="mb-4">
              {/* Bakkiyalakshmi will add Current Medications input here */}
            </div>
            
            {/* Allergies input will go here */}
            <div className="mb-4">
              {/* Bakkiyalakshmi will add Allergies input here */}
            </div>
          </div>
          
          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <i className="bx bx-save h-4 w-4 text-gray-500 group-hover:text-gray-400"></i>
              </span>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
export { ProfilePhotoSection, PersonalInfoSection };