import { useState } from 'react';
import axios from 'axios';
import "./LoginPage.css"

export default function LoginPage() {
  // Modes: 'signin', 'signup', 'forgot'
  const [mode, setMode] = useState('signin');

  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendUserData = async (e) => {
    console.log("Button.CLicked");
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', formData);
      alert("data sent");
      console.log(response);
      setMode('signin');
    }
    catch (err) {
      console.error("error:", err);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* MAIN BOX */}
      <div className="auth-box">
        {mode === 'signin' ? (
          <div className="form-content">
            <h2>Login In</h2>
            <input name="email" placeholder="Email" onChange={handleInputChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleInputChange} />
            <button className="primary-btn">Login</button>
            <p>New here? <span className="toggle-link" onClick={() => setMode('signup')}>Create account</span></p>
          </div>
        ) : mode === 'signup' ? (
          <div className="form-content">
            <h2>Create Account</h2>
            <p className="subtitle">Personal Information</p>
            <input name="fullName" placeholder="Full Name" onChange={handleInputChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleInputChange} />
            <input name="email" placeholder="Email Address" onChange={handleInputChange} />
            <input name="password" type="password" placeholder="Create Password" onChange={handleInputChange} />
            <button className="primary-btn" onClick={sendUserData}>Register</button>
            <p>Already have an account? <span className="toggle-link" onClick={() => setMode('signin')}>Sign In</span></p>
          </div>
        ) : (
          <div className="form-content">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a recovery link.</p>
            <input name="email" placeholder="Email Address" />
            <button className="primary-btn">Send Link</button>
            <p><span className="toggle-link" onClick={() => setMode('signin')}>Back to Login</span></p>
          </div>
        )}
      </div>

      {/* FORGOT PASSWORD (BELOW THE BOX) */}
      {mode === 'signin' && (
        <div className="external-link">
          <span onClick={() => setMode('forgot')}>Forgot your password?</span>
        </div>
      )}
    </div>
  );
}