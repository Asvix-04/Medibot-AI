import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.jpeg';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { useToast } from '../context/ToastContext';

const ProfilePhotoSection = ({ profileImage, setProfileImage }) => {
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
    <div className="flex flex-col items-center">
      <div 
        onClick={handleImageClick} 
        className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer group hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
        style={{ boxShadow: '0 0 25px rgba(88, 80, 236, 0.15)' }}
      >
        <img 
          src={profileImage || defaultAvatar} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-purple-600/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="text-white text-sm font-medium px-4 py-2 rounded-full bg-white/20 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/30">
            Change Photo
          </div>
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
        className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Upload Photo
      </button>
    </div>
  );
};

const FormSection = ({ title, children, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 backdrop-blur-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl mr-4 shadow-md">
          {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const InputField = ({ label, id, type = "text", value, onChange, placeholder, icon, disabled = false, children }) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {children || (
          <input
            type={type}
            name={id}
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`block w-full pl-11 pr-4 py-3 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${disabled ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          />
        )}
      </div>
    </div>
  );
};

const PersonalInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div>
      <InputField 
        label="Full Name" 
        id="fullName" 
        value={formData.fullName}
        onChange={handleChange}
        placeholder="John Doe"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>}
      />

      <InputField 
        label="Display Name" 
        id="displayName" 
        value={formData.displayName}
        onChange={handleChange}
        placeholder="@johndoe"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>}
      >
      </InputField>
      <p className="mt-1 ml-1 text-xs text-gray-500">This is how you'll appear to other users</p>

      <InputField 
        label="Date of Birth" 
        id="dateOfBirth" 
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>}
      />

      <div className="mb-5">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="block w-full pl-11 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all duration-200 hover:bg-gray-100"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div>
      <InputField 
        label="Email Address" 
        id="email" 
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        disabled={formData.emailVerified}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
        </svg>}
      />
      
      {formData.emailVerified ? (
        <div className="mt-1 ml-1 text-xs text-green-600 flex items-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Verified email
        </div>
      ) : (
        <div className="mt-1 ml-1 text-xs text-gray-500 mb-5">We'll send a verification link to this email</div>
      )}

      <InputField 
        label="Phone Number" 
        id="phoneNumber" 
        type="tel"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="(555) 123-4567"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>}
      />
      <p className="mt-1 ml-1 mb-5 text-xs text-gray-500">We'll only use this for account recovery and important notifications</p>

      <InputField 
        label="Location" 
        id="location" 
        value={formData.location}
        onChange={handleChange}
        placeholder="City, Country"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>}
      />
    </div>
  );
};

const PreferencesSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div>
      <div className="mb-5">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Language
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <select
            name="language"
            id="language"
            value={formData.language}
            onChange={handleChange}
            className="block w-full pl-11 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all duration-200 hover:bg-gray-100"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <select
            name="timezone"
            id="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="block w-full pl-11 pr-10 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all duration-200 hover:bg-gray-100"
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="EST">Eastern Standard Time</option>
            <option value="CST">Central Standard Time</option>
            <option value="MST">Mountain Standard Time</option>
            <option value="PST">Pacific Standard Time</option>
            <option value="GMT">Greenwich Mean Time</option>
            <option value="IST">India Standard Time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="receiveEmails"
                name="receiveEmails"
                type="checkbox"
                checked={formData.receiveEmails}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="receiveEmails" className="font-medium text-gray-700">Receive email notifications</label>
              <p className="text-xs text-gray-500 mt-1">Get updates about conversations, health insights, and recommendations</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="darkMode"
                name="darkMode"
                type="checkbox"
                checked={formData.darkMode}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="darkMode" className="font-medium text-gray-700">Use dark mode by default</label>
              <p className="text-xs text-gray-500 mt-1">Enable dark mode for reduced eye strain and battery usage</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareData"
                name="shareData"
                type="checkbox"
                checked={formData.shareData}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all duration-200"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareData" className="font-medium text-gray-700">Help improve Medibot with anonymized data</label>
              <p className="text-xs text-gray-500 mt-1">Your data will be anonymized and used to improve our AI systems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSummary = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [profileImage, setProfileImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    displayName: '',
    dateOfBirth: '',
    gender: ''
  });
  
  const [contactInfo, setContactInfo] = useState({
    email: '',
    emailVerified: false,
    phoneNumber: '',
    location: ''
  });
  
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    receiveEmails: true,
    darkMode: false,
    shareData: true
  });

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user is signed in");
        
        // Get profile data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Set profile image if available
          if (userData.photoURL) {
            setProfileImage(userData.photoURL);
          }
          
          // Set personal information
          setPersonalInfo({
            fullName: userData.fullName || '',
            displayName: userData.displayName || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || ''
          });
          
          // Set contact information
          setContactInfo({
            email: user.email || '',
            emailVerified: user.emailVerified || false,
            phoneNumber: userData.phoneNumber || '',
            location: userData.location || ''
          });
          
          // Set preferences
          setPreferences({
            language: userData.language || 'en',
            timezone: userData.timezone || 'UTC',
            receiveEmails: userData.receiveEmails !== undefined ? userData.receiveEmails : true,
            darkMode: userData.darkMode || false,
            shareData: userData.shareData !== undefined ? userData.shareData : true
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        addToast("Couldn't load profile data. Please try again.", "error");
      }
    };
    
    fetchUserData();
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is signed in");
      
      // Combine data from all sections
      const profileData = {
        fullName: personalInfo.fullName,
        displayName: personalInfo.displayName,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        phoneNumber: contactInfo.phoneNumber,
        location: contactInfo.location,
        language: preferences.language,
        timezone: preferences.timezone,
        receiveEmails: preferences.receiveEmails,
        darkMode: preferences.darkMode,
        shareData: preferences.shareData,
        photoURL: profileImage,
        updatedAt: new Date()
      };
      
      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
      
      // Show success notification
      addToast("Profile updated successfully!", "success");
      
      // Navigate to profile view
      navigate('/user-profile');
      
    } catch (error) {
      console.error("Error saving profile:", error);
      addToast(`Error saving profile: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">  {/* Change from max-w-4xl to max-w-2xl */}
        {/* Elegant header */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-2xl shadow-lg transform -skew-y-1" />
          
          <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-20"> {/* Smaller negative margins */}
              <svg width="300" height="300" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                {/* SVG path remains the same */}
              </svg>
            </div>
            
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 opacity-10"> {/* Smaller negative margins */}
              <svg width="150" height="150" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                {/* SVG path remains the same */}
              </svg>
            </div>
            
            <div className="p-10 text-white relative">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1">Your Profile</h1>
                  <p className="text-indigo-100">Customize your personal information and preferences</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Account Settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-8">
          <ProfilePhotoSection profileImage={profileImage} setProfileImage={setProfileImage} />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection 
            title="Personal Information" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <PersonalInfoSection 
              formData={personalInfo}
              setFormData={setPersonalInfo}
            />
          </FormSection>
          
          <FormSection 
            title="Contact Information" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            <ContactInfoSection 
              formData={contactInfo}
              setFormData={setContactInfo}
            />
          </FormSection>
          
          <FormSection 
            title="Preferences" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          >
            <PreferencesSection 
              formData={preferences}
              setFormData={setPreferences}
            />
          </FormSection>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur-md opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative flex items-center justify-center">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Profile...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Profile
                  </>
                )}
              </div>
            </button>
          </div>
          
          <div className="flex justify-center pb-8">
            <p className="text-center text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSummary;
export { ProfilePhotoSection, PersonalInfoSection };