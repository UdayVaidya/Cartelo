import React from 'react';
import { useAuth } from '../../Auth/hooks/useAuth';

const DashBoard = () => {
  const { handleLogout, user } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <h1>DashBoard</h1>
      {user && <p>Welcome, {user.fullName || user.email}!</p>}
      <button 
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#f5c518',
          color: '#080808',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default DashBoard;