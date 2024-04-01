import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewRestaurantReviews = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

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
            } catch (err) {
                console.error(err);
            }
        };

        fetchReviews();
        fetchRestaurant();
    }, [id]);

    return (
        <div>
            {restaurant ? (
                <div>
                    <h1>Restaurant reviews</h1>
                    <h2>{restaurant.restaurantName}</h2>
                    <p>ID: {restaurant._id}</p>
                    <p>Cuisine: {restaurant.cuisine}</p>
                    <p>Rating: {restaurant.rating}</p>
                    <p>Description: {restaurant.description}</p>

                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div>
                <h2>Reviews</h2>
                {Array.isArray(reviews) && reviews.length === 0 ? (
                    <p>No reviews found</p>
                ) : (
                    Array.isArray(reviews) && reviews.map((review) => (
                        review && <div key={review._id ? review._id : Math.random()} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
                            <h3>{review.title}</h3>
                            <p>Reviewed by: {review.name}</p>
                            <p>Stars: {review.stars}</p>
                            <p>{review.textarea}</p>
                        </div>
                    ))
                )}
            </div>


        </div>


    );
};

export default ViewRestaurantReviews;