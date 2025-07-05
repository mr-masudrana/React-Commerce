// src/pages/Register.jsx
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" placeholder="Email" required
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login" className="text-blue-600">Login here</Link>
      </p>
    </div>
  );
}
