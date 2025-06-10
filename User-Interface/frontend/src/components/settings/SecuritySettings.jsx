import React, { useState } from 'react';
import { auth } from '../../firebase';
import { 
  updatePassword, 
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification
} from 'firebase/auth';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  
  const [activeSessions, setActiveSessions] = useState([
    { device: 'Windows PC - Chrome', location: 'Mumbai, India', lastActive: new Date() },
    { device: 'iPhone 13 - Safari', location: 'Delhi, India', lastActive: new Date(Date.now() - 86400000) }
  ]);
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    storeConversations: true,
    allowDataAnalysis: true,
    receiveEmails: true
  });

  // Password strength calculation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (/[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^A-Za-z0-9]/.test(value)) strength += 1;
    
    setPasswordStrength(strength);
    
    // Check if passwords match
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };
  
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(newPassword === value);
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings({ ...privacySettings, [name]: checked });
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordMatch) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const user = auth.currentUser;
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
      } else {
        setMessage({ type: 'error', text: `Error: ${error.message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendVerification = async () => {
    try {
      const user = auth.currentUser;
      await sendEmailVerification(user);
      setMessage({ type: 'success', text: 'Verification email sent successfully' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };
  
  const handleLogoutSession = (index) => {
    const updatedSessions = [...activeSessions];
    updatedSessions.splice(index, 1);
    setActiveSessions(updatedSessions);
    setMessage({ type: 'success', text: 'Session terminated successfully' });
  };
  
  const handleLogoutAllSessions = () => {
    setActiveSessions([]);
    setMessage({ type: 'success', text: 'All sessions terminated successfully' });
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, implement actual account deletion
      setMessage({ type: 'success', text: 'Account deletion request submitted' });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h1>
        <p className="text-gray-600">Manage your account security and privacy preferences</p>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-violet-100 text-violet-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Password Change Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleChangePassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Current Password
                </label>
                <div className="relative rounded-md">
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  New Password
                </label>
                <div className="relative rounded-md">
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="block w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ease-out ${
                        passwordStrength === 0 ? 'w-0' :
                        passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                        passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                        passwordStrength === 3 ? 'w-3/4 bg-gray-700' :
                        'w-full bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {passwordStrength === 0 ? 'Enter password' :
                     passwordStrength === 1 ? 'Weak' :
                     passwordStrength === 2 ? 'Medium' :
                     passwordStrength === 3 ? 'Good' : 'Strong'}
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Confirm Password
                </label>
                <div className="relative rounded-md">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    className={`block w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 border ${
                      confirmPassword && !passwordMatch ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all`}
                  />
                </div>
                {confirmPassword && !passwordMatch && (
                  <p className="mt-0.5 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !passwordMatch || newPassword.length < 8}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg hover:from-violet-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Email Verification */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Email Verification
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                {auth.currentUser?.emailVerified ? 
                  'Your email is verified' : 
                  'Your email is not verified. Please verify your email to access all features.'}
              </p>
            </div>
            
            {!auth.currentUser?.emailVerified && (
              <button
                onClick={handleSendVerification}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg hover:from-violet-700 hover:to-indigo-800 transition-colors duration-300"
              >
                Send Verification Email
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Sessions */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Active Sessions
          </h2>
        </div>
        
        <div className="p-6">
          {activeSessions.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeSessions.map((session, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.device}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {session.lastActive.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleLogoutSession(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Logout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleLogoutAllSessions}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Logout All Devices
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">No active sessions found.</p>
          )}
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Privacy Settings
          </h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Store conversation history</h3>
                <p className="text-xs text-gray-500">Allow system to save your chat history</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="storeConversations" 
                  name="storeConversations" 
                  checked={privacySettings.storeConversations} 
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Allow data analysis</h3>
                <p className="text-xs text-gray-500">Share anonymized data to improve the service</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="allowDataAnalysis" 
                  name="allowDataAnalysis" 
                  checked={privacySettings.allowDataAnalysis} 
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                <p className="text-xs text-gray-500">Receive emails about updates and features</p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="receiveEmails" 
                  name="receiveEmails" 
                  checked={privacySettings.receiveEmails} 
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200">
          <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Danger Zone
          </h2>
        </div>
        
        <div className="p-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="text-sm font-medium text-red-800 mb-2">Delete your account</h3>
            <p className="text-xs text-red-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;