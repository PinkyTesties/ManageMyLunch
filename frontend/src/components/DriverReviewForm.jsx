import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../style/reviewForm.css';
import UserDashboard from './UserDashboard';
import Footer from './sharedComponents/Footer';

const DriverReviewForm = () => {
  const { email } = useParams(); // Get the driver email from the URL
  const navigate = useNavigate();

  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    driver_email: email // Set the restaurant ID to the one from the URL
  });
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/drivers/email/${email}`);
        setRestaurant(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRestaurant();
  }, [email]);
  useEffect(() => {
    setReview(prevReview => ({ ...prevReview, driver_email: email }));
  }, [email]);

  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/DriverReviewForm', review);
      alert('Review submitted successfully');
      setReview({
        name: '',
        stars: '',
        title: '',
        textarea: '',
        driver_email: ''
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
  <h1 className="form-title">Review your driver</h1>
  <form className="review-form" onSubmit={handleSubmit}>
    <label className="form-label">
      Name:
      <input type="text" name="name" value={review.name} onChange={handleChange} required />
    </label>
    <label className="form-label">
      Stars:
      <input type="text" name="stars" value={review.stars} onChange={handleChange} required />
    </label>
    <label className="form-label">
      Title:
      <input type="text" name="title" value={review.title} onChange={handleChange} required/>
    </label>
    <label className="form-label">
      Review:
      <input type="text" name="textarea" value={review.textarea} onChange={handleChange} required/>
    </label>
    <button className="form-submit-btn" type="submit">Submit Review</button>
  </form>
</div>



    <Footer />

    </div>

  );
};

export default DriverReviewForm;