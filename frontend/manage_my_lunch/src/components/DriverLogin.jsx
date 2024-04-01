import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './componentAssets/logov1.png';


axios.defaults.withCredentials = true;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8082/api/driverslogin", { email, password })
      .then(res => {
        console.log(res);
        navigate('/DriverDashboard');
      })
      .catch(err => {
        console.log(err);
        setError("Invalid email or password");

      });
  }

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <header className='driver-header'>
        <img src={logo} alt='Logo' height={100}/> 
        <h2>Login as a Driver</h2>
        <div>
          <button className='btn-btn'><Link to={'/'}>Login as customer</Link></button>
        </div>
      </header>
      <main className='main-login'>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
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
          <label htmlFor="password" className="form-label">
            Password
          </label>
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
      <br></br>
      
      </form>
      </main>
      
    </div>
  );
};

export default LoginPage;