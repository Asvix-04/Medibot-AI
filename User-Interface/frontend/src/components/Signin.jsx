import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import medibot_logo from '../assets/medibot_logo.jpg';
import { signInWithEmailAndPassword, signInWithPopup, fetchSignInMethodsForEmail, linkWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Email/Password login logic
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Login successful!");
      navigate('/chat');
      
    } catch (error) {
      console.error("Login error:", error);
      setError(getAuthErrorMessage(error.code));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Update user profile with Google information
      await updateUserProfileFromGoogle(user);
      
      navigate('/chat');
      console.log("Google sign-in successful!");
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      // Special handling for account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        
        try {
          const user = await handleAccountLinking(email, credential);
          await updateUserProfileFromGoogle(user);
          navigate('/chat');
        } catch (linkError) {
          setError(`An account already exists with this email. ${linkError.message}`);
        }
      } else {
        setError(getAuthErrorMessage(error.code));
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was canceled.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in operation canceled due to another conflicting request.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations.';
      default:
        return 'An error occurred during sign-in. Please try again.';
    }
  };

  // Add this in the Signin component
  const handleAccountLinking = async (email, googleCredential) => {
    try {
      // Get the sign-in methods for this email
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      // If user has an email/password account, prompt them to enter password to link accounts
      if (methods.includes('password')) {
        // Here you would typically show a modal or form to collect their password
        // For simplicity, let's assume we have a way to get their password:
        const password = prompt(`This email already exists with password login. Please enter your password to link your Google account:`);
        
        if (!password) {
          throw new Error('Password required to link accounts');
        }
        
        // Sign in with email/password 
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Link Google credential to this account
        await linkWithCredential(userCredential.user, googleCredential);
        
        return userCredential.user;
      }
      
      throw new Error('Account exists with different sign-in method');
    } catch (error) {
      console.error("Account linking failed:", error);
      throw error;
    }
  };

  // Add this to your Signin component
  const updateUserProfileFromGoogle = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      // If user exists, update only necessary fields
      if (userDoc.exists()) {
        await setDoc(userRef, {
          photoURL: user.photoURL || userDoc.data().photoURL,
          emailVerified: user.emailVerified,
          lastLogin: new Date(),
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // Create new user record
        await setDoc(userRef, {
          fullName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          phoneNumber: user.phoneNumber || '',
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: new Date(),
          authProvider: 'google'
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Continue anyway - don't block sign-in due to profile update issues
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img className="mx-auto h-20 w-auto" src={medibot_logo} alt="Medibot Logo" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">create a new account</Link>
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={submitting}
              type="button"
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;