import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../services/auth';
import { validateInput, sanitizeInput } from '../utils/inputUtils';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const validationResult = validateInput(userId, 'text', { minLength: 3, maxLength: 50 });
    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }

    const sanitizedUserId = sanitizeInput(userId);

    try {
      const result = await AuthService.login(sanitizedUserId);
      if (result.success) {
        history.push('/');
      } else {
        setError(result.error || `Login failed for ${sanitizedUserId}. Please try again.`);
      }
    } catch (err) {
      setError(`An unexpected error occurred for ${sanitizedUserId}. Please try again.`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;