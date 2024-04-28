import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import logo from './componentAssets/logov1.png';
import { backendURL } from './../urls'; // import backendURL from urls.js

const ViewRestaurantReviews = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/reviewForm/${id}`);
                setReviews(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/restaurants/${id}`);
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
                    <header>
                        <img src={logo} alt='Logo' height={100} />
                        <h1>Restaurant reviews</h1>
                        <p></p>
                    </header>
                    <hr />
                    <h2>{restaurant.restaurantName}</h2>
                    <h6>Cuisine: {restaurant.cuisine}</h6>
                    <h6>Rating: {restaurant.rating}</h6>
                    <h6>Description: {restaurant.description}</h6>
                    <br />
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div className='review'>
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