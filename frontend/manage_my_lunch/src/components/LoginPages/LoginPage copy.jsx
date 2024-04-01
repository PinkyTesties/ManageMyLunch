import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    axios.post("http://localhost:8082/api/login", { email, password })
      .then(res => {
        console.log(res);
        navigate('/dashboard');
      })
      .catch(err => {
        console.log(err);
        setError("Invalid email or password");

      });
  }

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <img src={logo} alt='Logo' height={100} />

      <h2>Login</h2>
      <p>***THIS PAGE STILL REQUIRES CSS. DO NOT SUBMIT AS IS***</p>

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
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <Link to="/sign-up" className="btn btn-link">
          Sign Up
        </Link>
      <br></br>
        <Link to="/UpdatePassword" className="btn btn-link">
          I forgot my password
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;