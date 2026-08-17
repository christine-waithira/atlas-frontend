import React, { useState, useEffect } from 'react';
import AssetList from './AssetList';
import TicketManager from './TicketManager';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('assets');

  // Check if user is logged in on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const rawUser = localStorage.getItem('user');
      const user = rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : null;
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // If not logged in, show the Login screen
  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div style={styles.container}>
      {/* HEADER BAR */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>ATLAS </h1>
          <p style={styles.subtitle}>Welcome back, {user.name} 👋</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log Out
        </button>
      </header>

      {/* NAVIGATION TABS */}
      <nav style={styles.nav}>
        <button
          onClick={() => setActiveTab('assets')}
          style={activeTab === 'assets' ? styles.activeTabBtn : styles.tabBtn}
        >
          📦 Asset Inventory
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          style={activeTab === 'tickets' ? styles.activeTabBtn : styles.tabBtn}
        >
          🎫 Support Tickets
        </button>
      </nav>

      {/* ACTIVE TAB CONTENT */}
      <main style={styles.main}>
        {activeTab === 'assets' ? <AssetList /> : <TicketManager />}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  title: { margin: 0, fontSize: '24px', color: '#0f172a' },
  subtitle: { margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' },
  logoutBtn: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  nav: { display: 'flex', gap: '12px', marginBottom: '24px' },
  tabBtn: { padding: '10px 20px', border: 'none', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  activeTabBtn: { padding: '10px 20px', border: 'none', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  main: { maxWidth: '1200px', margin: '0 auto' },
};

export default App;