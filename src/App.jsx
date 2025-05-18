import { useState } from 'react'; // Removed Profiler and unused imports
import NavBar from './Components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './Components/HeroSection';
import Transactions from './Components/Transactions'; 
import Login from './Components/Login';
import Report from './Components/Report';  // Added the correct import for Report component
import Profile from './Components/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<HeroSection />} />
          <Route path='/report' element={<Report />} /> {/* Updated to use Report component */}
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/sign-in' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
