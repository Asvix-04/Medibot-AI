import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProfileSummary from './components/ProfileSummary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<ProfileSummary />} />
          <Route path="/" element={<Signin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
