import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserDashboard from './UserDashboard'; // Import UserDashboard

const ViewDriverReviews = () => {
    const { email } = useParams();
    const [reviews, setReviews] = useState([]);

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

            <h1>Reviews for {email}</h1>
            {reviews.map((review, index) => (
                <div key={index} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
                    <h2>{review.title}</h2>
                    <p>{review.textarea}</p>
                    <p>Reviewed by: {review.name}</p>
                    <p>Rating: {review.stars}</p>
                    <p>Review Date: {new Date(review.date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ViewDriverReviews;