import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import SellerDashboard, { SellerLogin } from './SellerDashboard.jsx';
import './index.css';

function Root() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  if (!isLoggedIn) {
    return <SellerLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (currentView === 'dashboard') {
    return (
      <SellerDashboard 
        onLogout={() => setIsLoggedIn(false)} 
        onNavigateToStudio={() => setCurrentView('studio')} 
      />
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);