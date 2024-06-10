/*
 DriverReviewForm.jsx

 This is the review form for the driver. The customer will enter their name, stars, title and review to submit a review for the driver.

 Created by Tyler Costa 19075541
 */

//React imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//Styles
import '../style/reviewForm.css';
//Header
import UserDashboard from './UserDashboard';
//Footer
import Footer from './sharedComponents/Footer';

const DriverReviewForm = () => {
  //Variables
  const { email } = useParams();
  const navigate = useNavigate();

  //Review object
  const [review, setReview] = useState({
    name: '',
    stars: '',
    title: '',
    textarea: '',
    //Assign the driver email to the review object attribute 'driver_email'
    driver_email: email
  });

  const [restaurant, setRestaurant] = useState(null);

  //Fetch the driver by email
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

  //Function to handle the change in the input fields
  const handleChange = e => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  //Function to handle the submit of the review
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/DriverReviewForm', review);
      //Alert the user that the review has been submitted
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

  //Render the review form, no comments in this part because its really just a form
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
            <input type="text" name="title" value={review.title} onChange={handleChange} required />
          </label>
          <label className="form-label">
            Review:
            <input type="text" name="textarea" value={review.textarea} onChange={handleChange} required />
          </label>
          <button className="form-submit-btn" type="submit">Submit Review</button>
        </form>
      </div>

      <Footer />

    </div>

  );
};

export default DriverReviewForm;