import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from './componentAssets/logov1.png';

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
            .post('http://localhost:8082/api/drivers', driver)
            .then((res) => {
                alert(res.data.msg);
                navigate('/Drivers');
            })
            .catch((err) => alert(err.response.data.error));
    };

    return (
        <div>
            <div>
                <header>
                    <img src={logo} alt='Logo' height={100} />
                    <h1>Add a driver</h1>
                    <p></p>
                </header>
                <hr />
                <div className='MenuButtons'>
                    <button><Link to={'/Dashboard'}>Dashboard</Link></button>
                    <button><Link to={'/Drivers'}>View Drivers</Link></button>
                </div>
            </div>
            <div className='delete-user'>
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

        </div>
    );
};

export default AddDriver;