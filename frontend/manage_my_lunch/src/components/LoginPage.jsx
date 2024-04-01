import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './componentAssets/logov1.png';
import background from './componentAssets/background.jpg';


axios.defaults.withCredentials = true;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8082/api/login", { email, password })
      .then(res => {
        console.log(res);
        navigate('/dashboard');
        document.body.classList.add('logged-in');
      })
      .catch(err => {
        console.log(err);
        setError("Invalid email or password");

      });
  }

  return (
    <div>
      <header className="header">
        <div className="header-center">
        <img src={logo} alt='Logo' height={100} />
        <h1>Manage My Lunch</h1>
        </div>
        <div className="header-left">
        <button className='btn-btn'><Link to="/sign-up">Sign Up</Link></button>
        <button className='btn-btn'><Link to={'/DriverLogin'}>Drivers Login</Link></button>
        </div>
      </header>
      <main className='main-login'>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      <br></br>
      <Link to="/UpdatePassword" className="forgot-password-link">I forgot my password</Link>
      </form>  
      </main>
    </div>
  );
};

export default LoginPage;