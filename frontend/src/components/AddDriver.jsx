import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { backendURL } from './../urls'; // import backendURL from urls.js

const AddDriver = () => {
    const navigate = useNavigate();

    const [driver, setDriver] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setDriver({ ...driver, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post(`${backendURL}/api/drivers`, driver)
            .then((res) => {
                alert(res.data.msg);
                navigate('/Drivers');
            })
            .catch((err) => alert(err.response.data.error));
    };

    return (
        <div>
            <div>
                <h1>Add a driver</h1>
      <button><Link to={'/Dashboard'}>Dashboard</Link></button>
      <button><Link to={'/Drivers'}>View Drivers</Link></button>

            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" onChange={handleChange} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" onChange={handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default AddDriver;