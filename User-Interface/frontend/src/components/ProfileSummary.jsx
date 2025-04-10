import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../assets/default-avatar.jpeg';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

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
      {/* Image upload UI */}
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

const PersonalInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Personal info fields */}
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

const MedicalInfoSection = ({ formData, setFormData }) => {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const diseaseOptions = [
    'Asthma', 
    'Diabetes', 
    'Hypertension', 
    'Heart Disease', 
    'Cancer', 
    'Stroke', 
    'Arthritis', 
    'Depression',
    'Thyroid Disorders'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const value = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Medical fields */}
      <div>
        <label htmlFor="bloodGroup" className="block text-xs font-medium text-gray-700 mb-1">
          Blood Group
        </label>
        <div className="relative rounded-md">
          <select
            name="bloodGroup"
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent appearance-none"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <i className="bx bx-chevron-down text-sm"></i>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="pastDiseases" className="block text-xs font-medium text-gray-700 mb-1">
          Past Diseases
        </label>
        <div className="relative rounded-md">
          <select
            multiple
            name="pastDiseases"
            id="pastDiseases"
            value={formData.pastDiseases}
            onChange={handleMultiSelect}
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
            size={4}
          >
            {diseaseOptions.map((disease) => (
              <option key={disease} value={disease}>{disease}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="familyHistory" className="block text-xs font-medium text-gray-700 mb-1">
          Family History
        </label>
        <div className="relative rounded-md">
          <select
            multiple
            name="familyHistory"
            id="familyHistory"
            value={formData.familyHistory}
            onChange={handleMultiSelect}
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
            size={4}
          >
            {diseaseOptions.map((disease) => (
              <option key={disease} value={disease}>{disease}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</p>
        </div>
      </div>
    </div>
  );
};

const HealthInfoSection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="medications" className="block text-xs font-medium text-gray-700 mb-1">
          Current Medications
        </label>
        <div className="relative rounded-md">
          <textarea
            name="medications"
            id="medications"
            rows={3}
            value={formData.medications}
            onChange={handleChange}
            placeholder="Enter medications separated by commas"
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
          />
          <div className="absolute top-3 right-0 pr-3 flex items-center pointer-events-none">
            <i className="bx bx-capsule text-gray-400 text-sm"></i>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Example: Aspirin, Metformin, Lisinopril</p>
      </div>
      
      <div>
        <label htmlFor="allergies" className="block text-xs font-medium text-gray-700 mb-1">
          Allergies
        </label>
        <div className="relative rounded-md">
          <textarea
            name="allergies"
            id="allergies"
            rows={3}
            value={formData.allergies}
            onChange={handleChange}
            placeholder="Enter allergies separated by commas"
            className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
          />
          <div className="absolute top-3 right-0 pr-3 flex items-center pointer-events-none">
            <i className="bx bx-test-tube text-gray-400 text-sm"></i>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Example: Peanuts, Penicillin, Latex</p>
      </div>
    </div>
  );
};

const ProfileSummary = () => {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    age: ''
  });
  const [medicalData, setMedicalData] = useState({
    bloodGroup: '',
    pastDiseases: [],
    familyHistory: []
  });
  const [healthData, setHealthData] = useState({
    medications: '',
    allergies: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debug log
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is signed in");
      console.log("Current user:", user); // Debug log
      
      // Combine data from all sections
      const profileData = {
        fullName: personalInfo.fullName,
        age: personalInfo.age,
        bloodGroup: medicalData.bloodGroup,
        pastDiseases: medicalData.pastDiseases,
        familyHistory: medicalData.familyHistory,
        medications: healthData.medications,
        allergies: healthData.allergies,
        updatedAt: new Date()
      };
      
      console.log("Saving profile data:", profileData); // Debug log
      
      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), profileData);
      console.log("Data saved successfully"); // Debug log
      
      // Success message and navigation
      alert("Profile saved successfully!");
      navigate('/user-profile'); // Navigate to profile view
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-black py-5 px-4 relative">
          <h1 className="text-center text-2xl font-bold text-white">Profile Summary</h1>
          <p className="mt-1 text-center text-xs text-gray-400 max-w-sm mx-auto">
            Complete your health profile for personalized care
          </p>
          
          <div className="absolute -bottom-3 left-0 right-0 h-6 bg-white" style={{
            clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)',
            opacity: 0.1
          }}></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 bg-white">
          <ProfilePhotoSection />
          <PersonalInfoSection 
            formData={personalInfo}
            setFormData={setPersonalInfo}
          />
          
          <div className="mt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Medical Information</h3>
            <MedicalInfoSection 
              formData={medicalData}
              setFormData={setMedicalData}
            />
          </div>
          
          <div className="mt-6 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Health Information</h3>
            <HealthInfoSection 
              formData={healthData}
              setFormData={setHealthData}
            />
          </div>
          
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
        </form>
      </div>
    </div>
  );
};

export default ProfileSummary;
export { ProfilePhotoSection, PersonalInfoSection };