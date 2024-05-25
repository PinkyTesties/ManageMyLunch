import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import UserDashboard from './UserDashboard'; // Import UserDashboard
import '../style/Reports.css'

const ViewRestaurantReviews = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/reviewForm/${id}`);
                setReviews(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/restaurants/${id}`);
                setRestaurant(response.data);
                setIsLoading(false); // set loading to false after data is fetched
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchReviews();
        fetchRestaurant();
    }, [id]);
    
    if (isLoading) {
        return <div>Loading...</div>; // display loading message while fetching data
    }
    
    return (
        <div>
        <UserDashboard /> {/* Use UserDashboard */}
        <h1>Reviews for Restaurant: {restaurant ? restaurant.restaurantName : 'Loading...'}</h1>
        <button className='restaurantButton' onClick={() => navigate(`/ShowRestaurantDetails/${restaurant ? restaurant._id : ''}`)}>Back to {restaurant.restaurantName}</button>
      
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div className='review-container' key={review._id ? review._id : index}>
              <h2>{review.title}</h2>
              <p>{review.textarea}</p>
              <p>Reviewed by: {review.name}</p>
              <p>Rating: {review.stars}</p>
              <p>Review Date: {new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className='review-container'>
            <p>No reviews for {restaurant ? restaurant.restaurantName : 'Loading...'}</p>
          </div>
        )}
      </div>
    );
};

export default ViewRestaurantReviews;