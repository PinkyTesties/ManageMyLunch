import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import Footer from './sharedComponents/Footer';
import '../style/reviewForm.css';

const ReviewForm = () => {
  const { id } = useParams(); // Get the restaurant ID from the URL
  const navigate = useNavigate();

  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    restaurantID: id // Set the restaurant ID to the one from the URL
  });
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, [id]);
  useEffect(() => {
    setReview(prevReview => ({ ...prevReview, restaurantID: id }));
  }, [id]);

  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/reviewForm', review);
      alert('Review submitted successfully');
      setReview({
        name: '',
        stars: '',
        title: '',
        textarea: '',
        restaurantID: ''
      });
      navigate('/OrderStatus');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <UserDashboard />
      <div className="review-form-container">
        <h1 className="form-title">Write a Review for '{restaurant ? restaurant.restaurantName : 'Loading...'}'</h1>

        <form className="review-form" onSubmit={handleSubmit}>
          <label className="form-label">
            Name:
            <input className="form-input" type="text" name="name" onChange={handleChange} />
          </label>
          <label className="form-label">
            Stars:
            <input className="form-input" type="number" name="stars" onChange={handleChange} />
          </label>
          <label className="form-label">
            Title:
            <input className="form-input" type="text" name="title" onChange={handleChange} />
          </label>
          <label className="form-label">
            Review:
            <textarea className="form-textarea" name="textarea" onChange={handleChange} />
          </label>
          <button className="form-submit-btn" type="submit">Submit Review</button>
        </form>
      </div>
      <Footer />
    </div>

  );
};

export default ReviewForm;