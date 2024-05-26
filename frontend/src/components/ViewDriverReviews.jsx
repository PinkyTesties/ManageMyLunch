/*
ViewDriverReviews.jsx

This is the page that displays the reviews for a specific driver
It fetches the reviews for the driver using the id passed in via the url and displays them

Created by Tyler Costa 19075541
*/

//React imports
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
//Header
import UserDashboard from './UserDashboard';
//Styles
import '../style/Reports.css'
//Footer
import Footer from './sharedComponents/Footer';

const ViewDriverReviews = () => {
  //Variables
  const { email } = useParams();
  const [reviews, setReviews] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  const [driverName, setDriverName] = useState('');

  //Fetch the driver name
  useEffect(() => {
    fetch(`http://localhost:8082/api/drivers/email/${email}`)
      .then(response => response.json())
      .then(data => setDriverName(data.name))
      .catch(error => console.error('Error:', error));
  }, [email]);

  //Fetch the reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/DriverReviewForm/${email}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    fetchReviews();
  }, [email]);

  //Render the page
  return (
    <div>
      {/* Header */}
      <UserDashboard />
      <h1>Reviews for Driver: {driverName}</h1>
      <button className='driverButton' onClick={() => navigate('/Drivers')}>View All Drivers</button>

      {/* Display the reviews */}
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div className='review-container' key={index}>
            <h2>{review.title}</h2>
            <p>{review.textarea}</p>
            <p>Reviewed by: {review.name}</p>
            <p>Rating: {review.stars}</p>
            <p>Review Date: {new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <div className='review-container'>
          {/**No reviews */}
          <p>No reviews for {driverName}</p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ViewDriverReviews;