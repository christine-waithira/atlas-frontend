import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const bodyData = isRegister ? { name, email, password, department } : { email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok && data && (data.token || data.user)) {
        // normalize token/user location
        const token = data.token || data.accessToken;
        const user = data.user || data;
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (onLoginSuccess) {
          onLoginSuccess(user);
        } else {
          window.location.reload();
        }
      } else {
        setError((data && data.message) || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? 'Create Atlas Account' : 'Welcome Back to Atlas'}</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

            <div style={styles.inputGroup}>
            <label style={styles.label}>Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            {isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsRegister(!isRegister)} style={styles.toggleLink}>
            {isRegister ? 'Log In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { margin: '0 0 24px 0', textAlign: 'center', color: '#0f172a', fontSize: '22px' },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' },
  button: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', fontSize: '15px' },
  toggleText: { marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
  toggleLink: { color: '#0284c7', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' },
};

export default Login;