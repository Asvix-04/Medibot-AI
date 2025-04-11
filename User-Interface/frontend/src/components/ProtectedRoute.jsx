import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = ({ children }) => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  if (!currentUser.emailVerified) {
    return <Navigate to="/verification-required" />;
  }
  
  return children;
};

export default ProtectedRoute;