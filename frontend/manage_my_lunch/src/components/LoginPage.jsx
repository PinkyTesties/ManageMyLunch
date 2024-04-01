import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from './componentAssets/logov1.png';
import { ToastContainer, toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "bottom-left",
    });
  };

  const handleErrors = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8082/login", inputValue, { withCredentials: true });
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        handleErrors(message);
      }
    } catch (error) {
      console.error(error);
    }
    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="container mt-5">
      <img src={logo} alt='Logo' height={100} />
      <h2>Login Account</h2>
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
            placeholder='Enter your email address'
            onChange={handleOnChange}
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
            placeholder='Enter your password'
            onChange={handleOnChange}
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
        <ToastContainer />
      </form>
    </div>
  );
};

export default Login;