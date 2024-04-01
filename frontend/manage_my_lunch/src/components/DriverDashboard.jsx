import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import RestaurantPanel from './RestaurantPanel';
import logo from './componentAssets/logov1.png';
Modal.setAppElement('#root');

const Dashboard = ({ history }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [university, setUniversity] = useState('');
    const [userID, setUserID] = useState('');

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const customStyles = {
        content: {
            top: '0%',
            right: '0%',
            bottom: 'auto',
            left: 'auto',
            width: '20%',
            height: '50%',
        },
    };

    useEffect(() => {
        axios.get('http://localhost:8082')
            .then((res) => {


                if (res.data.valid) {
                    setName(res.data.name);
                    setEmail(res.data.email);
                    setUserID(res.data._id);


                } else {
                    navigate('/DriversLogin');
                }
            })
            .catch(err => console.log(err))
    }, [])
   
    return (
        <div>
            <img src={logo} alt='Logo' height={100} />
            <h1>Driver Dashboard</h1>
            <p>***** CSS NOT DONE. DO NOT SUBMIT *****</p>

            <button onClick={toggleDropdown}>Account</button>
            <button className='header-button-right'><Link to={'/DriverLogin'} style={{ textDecoration: 'none', color: 'Black' }}>Logout</Link></button>
            <p>Logged in as: {name}, {email}, {userID}</p>
            <Modal
                isOpen={showDropdown}
                onRequestClose={toggleDropdown}
                contentLabel="Account Menu"
                style={customStyles}

            >
                <a href="#">Profile</a><br></br>


                <a href="/">Logout</a><br></br>
            </Modal>
 
            <div className='ShowBookList'>

                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <br />
                            <h2 className='display-4 text-center'>Orders available to assign</h2>
                        </div>
                    </div>

                </div>
           
            </div>

        </div>
    );
};




export default Dashboard;


