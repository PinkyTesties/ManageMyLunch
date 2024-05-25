import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './UserDashboard'; // Import UserDashboard
import '../style/Reports.css'

const ViewDriverReviews = () => {
    const { email } = useParams();
    const [reviews, setReviews] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  const [driverName, setDriverName] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8082/api/drivers/email/${email}`)
      .then(response => response.json())
      .then(data => setDriverName(data.name))
      .catch(error => console.error('Error:', error));
  }, [email]);

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

    return (
        <div>
        <UserDashboard /> {/* Use UserDashboard */}
        <h1>Reviews for Driver: {driverName}</h1>
      <button className='driverButton' onClick={() => navigate('/Drivers')}>View All Drivers</button>

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
          <p>No reviews for {driverName}</p>
        </div>
        )}
      </div>
    );
};

export default ViewDriverReviews;